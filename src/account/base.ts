import fetch from "cross-fetch"
import qs from "qs"

import { SaltEdgeError } from "../error"
import { omit } from "../util"

export type Locale =
  | "bg"
  | "cz"
  | "de"
  | "en"
  | "es-MX"
  | "es"
  | "fi"
  | "fr"
  | "he"
  | "hr"
  | "hu"
  | "it"
  | "nl"
  | "pl"
  | "pt-BR"
  | "pt"
  | "ro"
  | "ru"
  | "si"
  | "sk"
  | "tr"
  | "uk"
  | "zh-HK"
  | "zh"

type Categorization = "none" | "personal" | "business"

export interface Options {
  readonly appId?: string
  readonly secret?: string
}

export class Base {
  protected readonly requester: Requester

  constructor(options?: Options) {
    this.requester = new Requester(options)
  }
}

export interface ListResponse<T> {
  data: T[]
  meta: {
    next_id: string | null
    next_page: string | null
  }
  next?: () => Promise<ListResponse<T>>
}

export class Requester {
  readonly appId: string
  readonly secret: string
  customerSecret?: string
  connectionSecret?: string

  constructor(options?: Options) {
    const appId =
      options?.appId ||
      (typeof process !== "undefined" ? process.env.SALTEDGE_APP_ID : undefined)
    if (!appId) {
      throw new Error(
        "Please provide the appId or set the environment variable SALTEDGE_APP_ID.",
      )
    }
    const secret =
      options?.secret ||
      (typeof process !== "undefined" ? process.env.SALTEDGE_SECRET : undefined)
    if (!secret) {
      throw new Error(
        "Please provide the secret or set the environment variable SALTEDGE_SECRET.",
      )
    }
    this.appId = appId
    this.secret = secret
  }

  assertCustomerSecret() {
    if (!this.customerSecret) {
      throw new Error("Please provide customer secret.")
    }
  }

  assertConnectionSecret() {
    if (!this.connectionSecret) {
      throw new Error("Please provide connection secret.")
    }
  }

  async request(options: {
    method: string
    url: string
    query?: Record<string, any>
    body?: any
  }) {
    const { method, url, query, body } = options
    const input =
      "https://www.saltedge.com/api/v5" +
      url +
      qs.stringify(query, { addQueryPrefix: true })

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "App-id": this.appId,
      Secret: this.secret,
    }

    if (this.customerSecret) {
      headers["Customer-secret"] = this.customerSecret
    }

    if (this.connectionSecret) {
      headers["Connection-secret"] = this.connectionSecret
    }

    const res = await fetch(input, {
      method,
      headers,
      body: JSON.stringify(body),
    })

    const json = await res.json()

    if (res.status >= 400) {
      throw new SaltEdgeError(json, res.status)
    }

    return json
  }

  async create(options: { url: string; data?: any }) {
    const res = await this.request({
      url: options.url,
      body: { data: options.data },
      method: "POST",
    })
    return res.data
  }

  async get(options: { url: string; query?: Record<string, any> }) {
    const res = await this.request({ ...options, method: "GET" })
    return res.data
  }

  async show(options: { url: string; query: Record<string, any>; id: string }) {
    const res = await this.request({
      url: options.url + "/" + encodeURIComponent(options.query[options.id]),
      query: omit(options.query, [options.id]),
      method: "GET",
    })
    return res.data
  }

  async list(options: { url: string; query?: Record<string, any> }) {
    const res = await this.request({ ...options, method: "GET" })
    const next_id = res.meta.next_id
    if (next_id) {
      return {
        ...res,
        next: async () =>
          this.list({
            ...options,
            query: { ...options.query, from_id: next_id },
          }),
      }
    } else {
      return res
    }
  }

  async remove(options: {
    url: string
    query: Record<string, any>
    id: string
  }) {
    const res = await this.request({
      url: options.url + "/" + encodeURIComponent(options.query[options.id]),
      query: omit(options.query, [options.id]),
      method: "DELETE",
    })
    return res.data
  }

  async action(options: {
    url: string
    data: Record<string, any>
    action: string
    id: string
  }) {
    const res = await this.request({
      url:
        options.url +
        "/" +
        encodeURIComponent(options.data[options.id]) +
        "/" +
        options.action,
      body: { data: omit(options.data, [options.id]) },
      method: "PUT",
    })
    return res.data
  }

  async actionQuery(options: {
    url: string
    query: Record<string, any>
    action: string
    id: string
  }) {
    const res = await this.request({
      url:
        options.url +
        "/" +
        encodeURIComponent(options.query[options.id]) +
        "/" +
        options.action,
      query: omit(options.query, [options.id]),
      method: "PUT",
    })
    return res.data
  }

  async put(options: { url: string; data: Record<string, any> }) {
    const res = await this.request({
      url: options.url,
      body: { data: options.data },
      method: "PUT",
    })
    return res.data
  }

  async update(options: {
    url: string
    data: Record<string, any>
    id: string
  }) {
    const res = await this.request({
      url: options.url + "/" + encodeURIComponent(options.data[options.id]),
      query: omit(options.data, [options.id]),
      method: "PUT",
    })
    return res.data
  }
}

export namespace Countries {
  export namespace list {
    export type Options = {
      include_fake_providers?: boolean
    }
    export type Response = {
      name: string
      code: string
      refresh_start_time: number
    }[]
  }
}

export namespace Providers {
  export type Attributes = {
    id: string
    code: string
    name: string
    mode: "oauth" | "web" | "api" | "file"
    status: "active" | "inactive" | "disabled"
    automatic_fetch: boolean
    customer_notified_on_sign_in: boolean
    interactive: boolean
    identification_mode: "client" | "saltedge"
    instruction: string
    home_url: string
    login_url: string
    logo_url: string
    country_code: string
    refresh_timeout: number
    holder_info: string[]
    max_consent_days: number
    created_at: string
    updated_at: string
    timezone: string
    max_interactive_delay: number
    optional_interactivity: boolean
    regulated: boolean
    max_fetch_interval: number
    supported_fetch_scopes: string[]
    supported_account_extra_fields: string[]
    supported_transaction_extra_fields: string[]
    supported_account_natures: string[]
    supported_account_types: string[]
    identification_codes: string[]
    bic_codes: string[]
    supported_iframe_embedding: boolean
    payment_templates: string[]
    supported_payment_fields?: Record<string, string[]>
    required_payment_fields?: Record<string, string[]>
  }
  export namespace show {
    export type Options = {
      provider_code: string
      include_fake_providers?: boolean
    }
    export type Response = Attributes
  }
  export namespace list {
    export type Options = {
      from_id?: string
      per_page?: number
      from_date?: string
      country_code?: string
      mode?: Attributes["mode"]
      include_fake_providers?: boolean
      include_provider_fields?: boolean
      provider_key_owner?: string
      include_payments_fields?: boolean
    }
    export type Response = ListResponse<Attributes>
  }
}

export namespace Customers {
  export type Attributes = {
    id: number
    identifier: string
    secret: string
    blocked_at?: string
  }
  export namespace create {
    export type Options = {
      identifier: string
    }
    export type Response = Attributes
  }
}

export namespace ConnectSessions {
  type ProviderMode = "oauth" | "web" | "api" | "file"
  type JavascriptCallbackType =
    | "iframe"
    | "external_saltbridge"
    | "external_notify"
    | "post_message"
  type CredentialsStrategy = "store" | "do_not_store" | "ask"
  type Theme = "default" | "dark"

  export type Attributes = {
    expires_at: string
    connect_url: string
  }

  export namespace create {
    export type Options = {
      consent: Consents.Params
      attempt?: Attempts.Params
      allowed_countries?: string[]
      provider_code?: string
      daily_refresh?: boolean
      disable_provider_search?: boolean
      return_connection_id?: boolean
      provider_modes?: ProviderMode[]
      categorization?: Categorization
      javascript_callback_type?: JavascriptCallbackType
      include_fake_providers?: boolean
      lost_connection_notify?: boolean
      show_consent_confirmation?: boolean
      credentials_strategy?: CredentialsStrategy
      return_error_class?: boolean
      theme?: Theme
      connect_template?: string
      show_connect_overview?: boolean
    }
    export type Response = Attributes
  }
  export namespace reconnect {
    export type Options = {
      consent: Consents.Params
      attempt?: Attempts.Params
      daily_refresh?: boolean
      return_connection_id?: boolean
      provider_modes?: ProviderMode[]
      javascript_callback_type?: JavascriptCallbackType
      categorization?: Categorization
      include_fake_providers?: boolean
      lost_connection_notify?: boolean
      show_consent_confirmation?: boolean
      credentials_strategy?: CredentialsStrategy
      return_error_class?: boolean
      theme?: Theme
      connect_template?: string
      show_connect_overview?: boolean
      override_credentials_strategy?: "ask" | "override"
    }
    export type Response = Attributes
  }
  export namespace refresh {
    export type Options = {
      attempt?: Attempts.Params
      daily_refresh?: boolean
      return_connection_id?: boolean
      provider_modes?: ProviderMode[]
      javascript_callback_type?: JavascriptCallbackType
      categorization?: Categorization
      lost_connection_notify?: boolean
      include_fake_providers?: boolean
      return_error_class?: boolean
      theme?: Theme
      connect_template?: string
      show_connect_overview?: boolean
    }
    export type Response = Attributes
  }
}

export namespace OAuthProviders {
  export type Attributes = {
    connection_id: string
    connection_secret: string
    attempt_id: string
    token: string
    expires_at: string
    redirect_url: string
  }
  export namespace create {
    export type Options = {
      country_code: string
      provider_code: string
      consent: Consents.Params
      attempt?: Attempts.Params
      daily_refresh?: boolean
      return_connection_id?: boolean
      categorization?: Categorization
      include_fake_providers?: boolean
    }
    export type Response = Attributes
  }
  export namespace reconnect {
    export type Options = {
      consent: Consents.Params
      attempt?: Attempts.Params
      daily_refresh?: boolean
      return_connection_id?: boolean
      categorization?: Categorization
      include_fake_providers?: boolean
    }
    export type Response = Attributes
  }
  export namespace authorize {
    export type Options = {
      query_string: string
    }
    export type Response = {
      country_code: string
      // TODO:
    }
  }
}

export namespace Connections {
  export type Attributes = {
    id: string
    secret: string
    provider_id: string
    provider_code: string
    provider_name: string
    daily_refresh: boolean
    customer_id: string
    created_at: string
    updated_at: string
    last_success_at: string
    status: "active" | "inactive" | "disabled"
    country_code: string
    next_refresh_possible_at?: string
    store_credentials: boolean
    last_attempt: Attempts.Attributes
    show_consent_confirmation: boolean
    last_consent_id: string
  }

  export namespace show {
    export type Options = never
    export type Response = Attributes
  }

  export namespace create {
    export type Options = {
      country_code: string
      provider_code: string
      consent: Consents.Params
      attempt?: Attempts.Params
      credentials?: Record<string, any>
      encrypted_credentials?: Record<string, any>
      daily_refresh?: boolean
      include_fake_providers?: boolean
      categorization?: Categorization
      file_url?: string
    }
    export type Response = Attributes
  }

  export namespace reconnect {
    export type Options = {
      credentials?: Record<string, any>
      encrypted_credentials?: Record<string, any>
      consent?: Consents.Params
      attempt?: Attempts.Params
      daily_refresh?: boolean
      include_fake_providers?: boolean
      categorization?: Categorization
      file_url?: string
      override_credentials?: boolean
    }
    export type Response = Attributes
  }

  export namespace interactive {
    export type Options = {
      country_code: string
      provider_code: string
      consent: Consents.Params
      attempt?: Attempts.Params
      credentials?: Record<string, any>
      encrypted_credentials?: Record<string, any>
      daily_refresh?: boolean
      include_fake_providers?: boolean
      categorization?: Categorization
      file_url?: string
    }
    export type Response = Attributes
  }

  export namespace refresh {
    export type Options = {
      attempt?: Attempts.Params
      daily_refresh?: boolean
      include_fake_providers?: boolean
      categorization?: Categorization
    }
    export type Response = Attributes
  }

  export namespace update {
    export type Options = {
      status?: "inactive"
      daily_refresh?: boolean
      store_credentials?: boolean
    }
    export type Response = Attributes
  }

  export namespace remove {
    export type Options = never
    export type Response = {
      id: string
      removed: boolean
    }
  }
}

export namespace Consents {
  type Scope = "account_details" | "holder_information" | "transactions_details"
  export type Params = {
    scopes: Scope[]
    from_date?: string
    to_date?: string
    period_days?: number
  }
  export type Attributes = {
    id: string
    connection_id: string
    customer_id: string
    scopes: Scope[]
    period_days: number
    expires_at: string
    from_date: string
    to_date: string
    collected_by: "client" | "saltedge"
    revoked_at: string
    revoke_reason: "expired" | "client" | "provider" | "saltedge"
    created_at: string
    updated_at: string
  }

  export namespace list {
    export type Options = {
      from_id?: string
      per_page?: number
    }
    export type Response = ListResponse<Attributes>
  }

  export namespace show {
    export type Options = {
      consent_id: string
    }
    export type Response = Attributes
  }

  export namespace revoke {
    export type Options = {
      consent_id: string
    }
    export type Response = Attributes
  }
}

export namespace Attempts {
  type FetchScope = "accounts" | "holder_info" | "transactions"
  type Stage = {
    created_at: string
    id: string
    interactive_fields_names?: string[]
    interactive_html?: string
    name: string
    updated_at: string
  }
  export type Params = {
    fetch_scopes?: FetchScope[]
    from_date?: string
    to_date?: string
    fetched_accounts_notify?: boolean
    custom_fields?: Record<string, any>
    locale?: Locale
    include_natures?: string[]
    customer_last_logged_at?: string
    exclude_accounts?: string[]
    store_credentials?: boolean
    user_present?: boolean
    return_to?: string
  }
  export type Attributes = {
    api_mode: "app" | "service"
    api_version: string
    automatic_fetch: boolean
    daily_refresh: boolean
    categorization: Categorization
    created_at: string
    custom_fields: Record<string, any>
    device_type: "desktop" | "tablet" | "mobile"
    remote_ip: string
    exclude_accounts: string[]
    user_present: boolean
    customer_last_logged_at: string
    fail_at: string
    fail_error_class: string
    fail_message: string
    fetch_scopes: FetchScope[]
    finished: boolean
    finished_recent: boolean
    from_date: string
    id: string
    interactive: boolean
    locale: Locale
    partial: boolean
    store_credentials: boolean
    success_at: string
    to_date: string
    updated_at: string
    show_consent_confirmation: boolean
    include_natures: string[]
    stages: Stage[]
  }

  export namespace list {
    export type Options = {
      from_id?: string
      per_page?: number
    }
    export type Response = ListResponse<Attributes>
  }

  export namespace show {
    export type Options = {
      attempt_id: string
    }
    export type Response = Attributes
  }
}

export namespace Accounts {
  type Nature =
    | "account"
    | "bonus"
    | "card"
    | "checking"
    | "credit"
    | "credit_card"
    | "debit_card"
    | "ewallet"
    | "insurance"
    | "investment"
    | "loan"
    | "mortgage"
    | "savings"

  export type Attributes = {
    id: string
    name: string
    nature: Nature
    balance: number
    currency_code: string
    connection_id: string
    created_at: string
    updated_at: string
    extra: {
      account_name?: string
      account_number?: string
      assets?: string[]
      available_amount?: number
      balance_type?: string
      blocked_amount?: number
      card_type?:
        | "american_express"
        | "china_unionpay"
        | "diners_club"
        | "jcb"
        | "maestro"
        | "master_card"
        | "uatp"
        | "visa"
        | "mir"
      cards?: string[]
      client_name?: string
      closing_balance?: number
      credit_limit?: number
      current_date?: string
      current_time?: string
      expiry_date?: string
      iban?: string
      interest_rate?: number
      interest_type?: string
      floating_interest_rate?: {
        min_value?: number
        max_value?: number
      }
      remaining_payments?: number
      penalty_amount?: number
      next_payment_amount?: number
      next_payment_date?: string
      open_date?: string
      opening_balance?: number
      partial?: boolean
      sort_code?: string
      statement_cut_date?: string
      status?: "active" | "inactive"
      swift?: string
      total_payment_amount?: number
      transactions_count?: {
        posted?: number
        pending?: number
      }
      payment_type?: string
      cashback_amount?: number
      monthly_total_payment?: number
      minimum_payment?: number

      investment_amount?: number
      unit_price?: number
      units?: number
      indicative_unit_price?: number
      interest_income?: number
      interest_amount?: number
      profit_amount?: number
      profit_rate?: number
      asset_class?: string
      product_type?: string
      total_unit_value?: number
      fund_holdings: Record<string, any>

      premium_frequency?: string
      policy_status?: string
      life_assured_name?: string
      premium_amount?: number
      single_premium_amount?: number
      financial_consultant?: string
      total_reversionary_bonus?: number
      gross_surrender?: number
      guaranteed_gross_surrender?: number
      reversionary_bonus_cash_value?: number
      owned_policy_amount?: number
      policy_loan_limit?: number
      policy_converted_to_paid_up?: number
      paid_up_conversion_reversionary_bonus?: number
      policy_components?: Record<string, any>
    }
  }

  export namespace list {
    export type Options = {
      from_id?: string
      per_page?: number
    }
    export type Response = ListResponse<Attributes>
  }
}

export namespace Transactions {
  export type Attributes = {
    id: string
    mode: "normal" | "fee" | "transfer"
    status: "posted" | "pending"
    made_on: string
    amount: number
    currency_code: string
    description: string
    category: TimeRanges
    duplicated: boolean
    account_id: string
    created_at: string
    updated_at: string
    extra: {
      account_balance_snapshot?: number
      account_number?: string
      additional?: string
      asset_amount?: number
      asset_code?: string
      categorization_confidence?: number
      check_number?: string
      closing_balance?: number
      constant_code?: string
      convert?: boolean
      customer_category_code?: string
      customer_category_name?: string
      exchange_rate?: number
      id?: string
      information?: string
      mcc?: string
      merchant_id?: string
      opening_balance?: number
      installment_debt_amount?: number
      original_amount?: number
      original_category?: string
      original_currency_code?: string
      original_subcategory?: string
      payee?: string
      payee_information?: string
      payer?: string
      payer_information?: string
      possible_duplicate?: boolean
      posting_date?: string
      posting_time?: string
      record_number?: string
      specific_code?: string
      tags?: string[]
      time?: string
      transfer_account_name?: string
      type?: string
      unit_price?: number
      units?: number
      variable_code?: string
    }
  }

  export namespace list {
    export type Options = {
      account_id?: string
      from_id?: string
      per_page?: number
    }
    export type Response = ListResponse<Attributes>
  }

  export namespace listDuplicates {
    export type Options = {
      account_id?: string
      from_id?: string
      per_page?: number
    }
    export type Response = ListResponse<Attributes>
  }

  export namespace pending {
    export type Options = {
      account_id?: string
      from_id?: string
      per_page?: number
    }
    export type Response = ListResponse<Attributes>
  }

  export namespace duplicate {
    export type Options = {
      transaction_ids?: string[]
    }
    export type Response = {
      duplicated: boolean
    }
  }

  export namespace unduplicate {
    export type Options = {
      transaction_ids?: string[]
    }
    export type Response = {
      unduplicated: boolean
    }
  }

  export namespace remove {
    export type Options = {
      account_id: string
      keep_days: number
    }
    export type Response = {
      cleanup_started: boolean
    }
  }
}
