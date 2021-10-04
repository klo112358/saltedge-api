import * as base from "./base"

type ConnectionSecret = {
  connection_secret: string
}

export class App extends base.Base {
  readonly Countries: Countries
  readonly Providers: Providers
  readonly Customers: Customers
  readonly ConnectSessions: ConnectSessions
  readonly OAuthProviders: OAuthProviders
  readonly Connections: Connections
  readonly Consents: Consents
  readonly Attempts: Attempts
  readonly Accounts: Accounts
  readonly Transactions: Transactions

  constructor(options?: Options) {
    super(options)
    this.requester.customer_secret = options?.customer_secret

    this.Countries = new Countries(this.requester)
    this.Providers = new Providers(this.requester)
    this.Customers = new Customers(this.requester)
    this.ConnectSessions = new ConnectSessions(this.requester)
    this.OAuthProviders = new OAuthProviders(this.requester)
    this.Connections = new Connections(this.requester)
    this.Consents = new Consents(this.requester)
    this.Attempts = new Attempts(this.requester)
    this.Accounts = new Accounts(this.requester)
    this.Transactions = new Transactions(this.requester)
  }

  get customer_secret() {
    return this.requester.customer_secret
  }

  set customer_secret(s: string | undefined) {
    this.requester.customer_secret = s
  }
}

export interface Options extends base.Options {
  readonly customer_secret?: string
  readonly connection_secret?: string
}

export namespace Countries {
  export namespace list {
    export type Options = base.Countries.list.Options
    export type Response = base.Countries.list.Response
  }
}

export class Countries {
  constructor(private readonly requester: base.Requester) {}

  async list(
    options?: Countries.list.Options,
  ): Promise<Countries.list.Response> {
    return this.requester.get({
      url: "/countries",
      query: options,
    })
  }
}

export namespace Providers {
  export type Attributes = base.Providers.Attributes
  export namespace show {
    export type Options = base.Providers.show.Options
    export type Response = base.Providers.show.Response
  }
  export namespace list {
    export type Options = base.Providers.list.Options
    export type Response = base.Providers.list.Response
  }
}

export class Providers {
  constructor(private readonly requester: base.Requester) {}

  async show(
    options: Providers.show.Options,
  ): Promise<Providers.show.Response> {
    return this.requester.show({
      url: "/providers",
      query: options,
      id: "provider_code",
    })
  }

  async list(
    options?: Providers.list.Options,
  ): Promise<Providers.list.Response> {
    return this.requester.list({
      url: "/providers",
      query: options,
    })
  }
}

export namespace Customers {
  export type Attributes = base.Customers.Attributes
  export namespace create {
    export type Options = base.Customers.create.Options
    export type Response = base.Customers.create.Response
  }
}

export class Customers {
  constructor(private readonly requester: base.Requester) {}

  async create(
    options: Customers.create.Options,
  ): Promise<Customers.create.Response> {
    return this.requester.create({
      url: "/customers",
      data: options,
    })
  }
}

export namespace ConnectSessions {
  export type Attributes = base.ConnectSessions.Attributes
  export namespace create {
    export type Options = base.ConnectSessions.create.Options
    export type Response = base.ConnectSessions.create.Response
  }
  export namespace reconnect {
    export type Options = base.ConnectSessions.reconnect.Options &
      ConnectionSecret
    export type Response = base.ConnectSessions.reconnect.Response
  }
  export namespace refresh {
    export type Options = base.ConnectSessions.refresh.Options &
      ConnectionSecret
    export type Response = base.ConnectSessions.refresh.Response
  }
}

export class ConnectSessions {
  constructor(private readonly requester: base.Requester) {}

  async create(
    options: ConnectSessions.create.Options,
  ): Promise<ConnectSessions.create.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.create({
      url: "/connect_sessions/create",
      data: options,
    })
  }

  async reconnect(
    options: ConnectSessions.reconnect.Options,
  ): Promise<ConnectSessions.reconnect.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.create({
      url: "/connect_sessions/reconnect",
      data: options,
    })
  }

  async refresh(
    options: ConnectSessions.refresh.Options,
  ): Promise<ConnectSessions.refresh.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.create({
      url: "/connect_sessions/refresh",
      data: options,
    })
  }
}

export namespace OAuthProviders {
  export type Attributes = base.OAuthProviders.Attributes
  export namespace create {
    export type Options = base.OAuthProviders.create.Options
    export type Response = base.OAuthProviders.create.Response
  }
  export namespace reconnect {
    export type Options = base.OAuthProviders.reconnect.Options &
      ConnectionSecret
    export type Response = base.OAuthProviders.reconnect.Response
  }
  export namespace authorize {
    export type Options = base.OAuthProviders.authorize.Options &
      ConnectionSecret
    export type Response = base.OAuthProviders.authorize.Response
  }
}

export class OAuthProviders {
  constructor(private readonly requester: base.Requester) {}

  async create(
    options: OAuthProviders.create.Options,
  ): Promise<OAuthProviders.create.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.create({
      url: "/oauth_providers/create",
      data: options,
    })
  }

  async reconnect(
    options: OAuthProviders.reconnect.Options,
  ): Promise<OAuthProviders.reconnect.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.create({
      url: "/oauth_providers/reconnect",
      data: options,
    })
  }

  async authorize(
    options: OAuthProviders.authorize.Options,
  ): Promise<OAuthProviders.authorize.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.put({
      url: "/oauth_providers/authorize",
      data: options,
    })
  }
}

export namespace Connections {
  export type Attributes = base.Connections.Attributes
  export namespace show {
    export type Options = ConnectionSecret
    export type Response = base.Connections.show.Response
  }
  export namespace create {
    export type Options = base.Connections.create.Options
    export type Response = base.Connections.create.Response
  }
  export namespace reconnect {
    export type Options = base.Connections.reconnect.Options & ConnectionSecret
    export type Response = base.Connections.reconnect.Response
  }
  export namespace interactive {
    export type Options = base.Connections.interactive.Options &
      ConnectionSecret
    export type Response = base.Connections.interactive.Response
  }
  export namespace refresh {
    export type Options = base.Connections.refresh.Options & ConnectionSecret
    export type Response = base.Connections.refresh.Response
  }
  export namespace update {
    export type Options = base.Connections.update.Options & ConnectionSecret
    export type Response = base.Connections.update.Response
  }
  export namespace remove {
    export type Options = ConnectionSecret
    export type Response = base.Connections.remove.Response
  }
}

export class Connections {
  constructor(private readonly requester: base.Requester) {}

  async show(
    options: Connections.show.Options,
  ): Promise<Connections.show.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.get({
      url: "/connections",
      query: options,
    })
  }

  async create(
    options: Connections.create.Options,
  ): Promise<Connections.create.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.create({
      url: "/connection",
      data: options,
    })
  }

  async reconnect(
    options: Connections.reconnect.Options,
  ): Promise<Connections.reconnect.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.put({
      url: "/connection/reconnect",
      data: options,
    })
  }

  async interactive(
    options: Connections.interactive.Options,
  ): Promise<Connections.interactive.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.put({
      url: "/connection/interactive",
      data: options,
    })
  }

  async refresh(
    options: Connections.refresh.Options,
  ): Promise<Connections.refresh.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.put({
      url: "/connection/refresh",
      data: options,
    })
  }

  async update(
    options: Connections.update.Options,
  ): Promise<Connections.update.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.put({
      url: "/connection",
      data: options,
    })
  }

  async remove(
    options: Connections.remove.Options,
  ): Promise<Connections.remove.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.request({
      method: "DELETE",
      url: "/connection",
      query: options,
    })
  }
}

export namespace Consents {
  export type Attributes = base.Consents.Attributes
  export namespace list {
    export type Options = base.Consents.list.Options & ConnectionSecret
    export type Response = base.Consents.list.Response
  }
  export namespace show {
    export type Options = base.Consents.show.Options & ConnectionSecret
    export type Response = base.Consents.show.Response
  }
  export namespace revoke {
    export type Options = base.Consents.revoke.Options & ConnectionSecret
    export type Response = base.Consents.revoke.Response
  }
}

export class Consents {
  constructor(private readonly requester: base.Requester) {}

  async list(options: Consents.list.Options): Promise<Consents.list.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.list({
      url: "/consents",
      query: options,
    })
  }

  async show(options: Consents.show.Options): Promise<Consents.show.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.show({
      url: "/consents",
      query: options,
      id: "consent_id",
    })
  }

  async revoke(
    options: Consents.revoke.Options,
  ): Promise<Consents.revoke.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.action({
      url: "/consents",
      action: "revoke",
      data: options,
      id: "consent_id",
    })
  }
}

export namespace Attempts {
  export type Attributes = base.Attempts.Attributes
  export namespace list {
    export type Options = base.Attempts.list.Options & ConnectionSecret
    export type Response = base.Attempts.list.Response
  }
  export namespace show {
    export type Options = base.Attempts.show.Options & ConnectionSecret
    export type Response = base.Attempts.show.Response
  }
}

export class Attempts {
  constructor(private readonly requester: base.Requester) {}

  async list(options: Attempts.list.Options): Promise<Attempts.list.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.list({
      url: "/attempts",
      query: options,
    })
  }

  async show(options: Attempts.show.Options): Promise<Attempts.show.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.show({
      url: "/attempts",
      query: options,
      id: "attempt_id",
    })
  }
}

export namespace Accounts {
  export type Attributes = base.Accounts.Attributes
  export namespace list {
    export type Options = base.Accounts.list.Options & ConnectionSecret
    export type Response = base.Accounts.list.Response
  }
}

export class Accounts {
  constructor(private readonly requester: base.Requester) {}

  async list(options: Accounts.list.Options): Promise<Accounts.list.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.list({
      url: "/accounts",
      query: options,
    })
  }
}

export namespace Transactions {
  export type Attributes = base.Transactions.Attributes
  export namespace list {
    export type Options = base.Transactions.list.Options & ConnectionSecret
    export type Response = base.Transactions.list.Response
  }
  export namespace listDuplicates {
    export type Options = base.Transactions.listDuplicates.Options &
      ConnectionSecret
    export type Response = base.Transactions.listDuplicates.Response
  }
  export namespace pending {
    export type Options = base.Transactions.pending.Options & ConnectionSecret
    export type Response = base.Transactions.pending.Response
  }
  export namespace duplicate {
    export type Options = base.Transactions.duplicate.Options & ConnectionSecret
    export type Response = base.Transactions.duplicate.Response
  }
  export namespace unduplicate {
    export type Options = base.Transactions.unduplicate.Options &
      ConnectionSecret
    export type Response = base.Transactions.unduplicate.Response
  }
  export namespace remove {
    export type Options = base.Transactions.remove.Options & ConnectionSecret
    export type Response = base.Transactions.remove.Response
  }
}

export class Transactions {
  constructor(private readonly requester: base.Requester) {}

  async list(
    options: Transactions.list.Options,
  ): Promise<Transactions.list.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.list({
      url: "/transactions",
      query: options,
    })
  }

  async listDuplicates(
    options: Transactions.listDuplicates.Options,
  ): Promise<Transactions.listDuplicates.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.list({
      url: "/transactions/duplicates",
      query: options,
    })
  }

  async pending(
    options: Transactions.pending.Options,
  ): Promise<Transactions.pending.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.list({
      url: "/transactions/pending",
      query: options,
    })
  }

  async duplicate(
    options: Transactions.duplicate.Options,
  ): Promise<Transactions.duplicate.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.put({
      url: "/transactions/duplicate",
      data: options,
    })
  }

  async unduplicate(
    options: Transactions.unduplicate.Options,
  ): Promise<Transactions.unduplicate.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.put({
      url: "/transactions/unduplicate",
      data: options,
    })
  }

  async remove(
    options: Transactions.unduplicate.Options,
  ): Promise<Transactions.unduplicate.Response> {
    this.requester.assertCustomerSecret()
    return this.requester.request({
      method: "DELETE",
      url: "/transactions",
      body: { data: options },
    })
  }
}
