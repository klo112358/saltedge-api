import * as base from "./base"

type CustomerId = {
  customer_id: string
}

type ConnectionId = {
  connection_id: string
}

export class Service extends base.Base {
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
}

export interface Options extends base.Options {}

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
  export namespace show {
    export type Options = {
      customer_id: number
    }
    export type Response = Attributes
  }
  export namespace list {
    export type Options = {
      identifier?: string
      from_id?: string
      per_page?: number
    }
    export type Response = base.ListResponse<Attributes>
  }
  export namespace remove {
    export type Options = {
      customer_id: number
    }
    export type Response = {
      deleted: boolean
      id: string
    }
  }
  export namespace lock {
    export type Options = {
      customer_id: number
    }
    export type Response = {
      locked: boolean
      id: string
    }
  }
  export namespace unlock {
    export type Options = {
      customer_id: number
    }
    export type Response = {
      unlocked: boolean
      id: string
    }
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

  async show(
    options: Customers.show.Options,
  ): Promise<Customers.show.Response> {
    return this.requester.show({
      url: "/customers",
      query: options,
      id: "customer_id",
    })
  }

  async list(
    options?: Customers.list.Options,
  ): Promise<Customers.list.Response> {
    return this.requester.list({
      url: "/customers",
      query: options,
    })
  }

  async remove(
    options: Customers.remove.Options,
  ): Promise<Customers.remove.Response> {
    return this.requester.remove({
      url: "/customers",
      query: options,
      id: "customer_id",
    })
  }

  async lock(
    options: Customers.remove.Options,
  ): Promise<Customers.remove.Response> {
    return this.requester.action({
      url: "/customers",
      action: "lock",
      data: options,
      id: "customer_id",
    })
  }

  async unlock(
    options: Customers.remove.Options,
  ): Promise<Customers.remove.Response> {
    return this.requester.action({
      url: "/customers",
      action: "unlock",
      data: options,
      id: "customer_id",
    })
  }
}

export namespace ConnectSessions {
  export type Attributes = base.ConnectSessions.Attributes
  export namespace create {
    export type Options = CustomerId & base.ConnectSessions.create.Options
    export type Response = base.ConnectSessions.create.Response
  }
  export namespace reconnect {
    export type Options = ConnectionId & base.ConnectSessions.reconnect.Options
    export type Response = base.ConnectSessions.reconnect.Response
  }
  export namespace refresh {
    export type Options = ConnectionId & base.ConnectSessions.refresh.Options
    export type Response = base.ConnectSessions.refresh.Response
  }
}

export class ConnectSessions {
  constructor(private readonly requester: base.Requester) {}

  async create(
    options: ConnectSessions.create.Options,
  ): Promise<ConnectSessions.create.Response> {
    return this.requester.create({
      url: "/connect_sessions/create",
      data: options,
    })
  }

  async reconnect(
    options: ConnectSessions.reconnect.Options,
  ): Promise<ConnectSessions.reconnect.Response> {
    return this.requester.create({
      url: "/connect_sessions/reconnect",
      data: options,
    })
  }

  async refresh(
    options: ConnectSessions.refresh.Options,
  ): Promise<ConnectSessions.refresh.Response> {
    return this.requester.create({
      url: "/connect_sessions/refresh",
      data: options,
    })
  }
}

export namespace OAuthProviders {
  export type Attributes = base.OAuthProviders.Attributes
  export namespace create {
    export type Options = CustomerId & base.OAuthProviders.create.Options
    export type Response = base.OAuthProviders.create.Response
  }
  export namespace reconnect {
    export type Options = ConnectionId & base.OAuthProviders.reconnect.Options
    export type Response = base.OAuthProviders.reconnect.Response
  }
  export namespace authorize {
    export type Options = ConnectionId & base.OAuthProviders.authorize.Options
    export type Response = base.OAuthProviders.authorize.Response
  }
}

export class OAuthProviders {
  constructor(private readonly requester: base.Requester) {}

  async create(
    options: OAuthProviders.create.Options,
  ): Promise<OAuthProviders.create.Response> {
    return this.requester.create({
      url: "/oauth_providers/create",
      data: options,
    })
  }

  async reconnect(
    options: OAuthProviders.reconnect.Options,
  ): Promise<OAuthProviders.reconnect.Response> {
    return this.requester.create({
      url: "/oauth_providers/reconnect",
      data: options,
    })
  }

  async authorize(
    options: OAuthProviders.authorize.Options,
  ): Promise<OAuthProviders.authorize.Response> {
    return this.requester.put({
      url: "/oauth_providers/authorize",
      data: options,
    })
  }
}

export namespace Connections {
  export type Attributes = base.Connections.Attributes
  export namespace list {
    export type Options = {
      customer_id: string
      from_id?: string
      per_page?: number
    }
    export type Response = base.ListResponse<Attributes>
  }
  export namespace show {
    export type Options = ConnectionId
    export type Response = base.Connections.show.Response
  }
  export namespace create {
    export type Options = CustomerId & base.Connections.create.Options
    export type Response = base.Connections.create.Response
  }
  export namespace reconnect {
    export type Options = ConnectionId & base.Connections.reconnect.Options
    export type Response = base.Connections.reconnect.Response
  }
  export namespace interactive {
    export type Options = CustomerId &
      ConnectionId &
      base.Connections.interactive.Options
    export type Response = base.Connections.interactive.Response
  }
  export namespace refresh {
    export type Options = ConnectionId & base.Connections.refresh.Options
    export type Response = base.Connections.refresh.Response
  }
  export namespace update {
    export type Options = ConnectionId & base.Connections.update.Options
    export type Response = base.Connections.update.Response
  }
  export namespace remove {
    export type Options = ConnectionId
    export type Response = base.Connections.remove.Response
  }
}

export class Connections {
  constructor(private readonly requester: base.Requester) {}

  async list(
    options: Connections.list.Options,
  ): Promise<Connections.list.Response> {
    return this.requester.list({
      url: "/connections",
      query: options,
    })
  }

  async show(
    options: Connections.show.Options,
  ): Promise<Connections.show.Response> {
    return this.requester.show({
      url: "/connections",
      query: options,
      id: "connection_id",
    })
  }

  async create(
    options: Connections.create.Options,
  ): Promise<Connections.create.Response> {
    return this.requester.create({
      url: "/connections",
      data: options,
    })
  }

  async reconnect(
    options: Connections.reconnect.Options,
  ): Promise<Connections.reconnect.Response> {
    return this.requester.action({
      url: "/connections",
      action: "reconnect",
      data: options,
      id: "connection_id",
    })
  }

  async interactive(
    options: Connections.interactive.Options,
  ): Promise<Connections.interactive.Response> {
    return this.requester.action({
      url: "/connections",
      action: "interactive",
      data: options,
      id: "connection_id",
    })
  }

  async refresh(
    options: Connections.refresh.Options,
  ): Promise<Connections.refresh.Response> {
    return this.requester.action({
      url: "/connections",
      action: "refresh",
      data: options,
      id: "connection_id",
    })
  }

  async update(
    options: Connections.update.Options,
  ): Promise<Connections.update.Response> {
    return this.requester.update({
      url: "/connections",
      data: options,
      id: "connection_id",
    })
  }

  async remove(
    options: Connections.remove.Options,
  ): Promise<Connections.remove.Response> {
    return this.requester.remove({
      url: "/connections",
      query: options,
      id: "connection_id",
    })
  }
}

export namespace Consents {
  export type Attributes = base.Consents.Attributes
  export namespace list {
    export type Options = (CustomerId | ConnectionId) &
      base.Consents.list.Options
    export type Response = base.Consents.list.Response
  }
  export namespace show {
    export type Options = (CustomerId | ConnectionId) &
      base.Consents.show.Options
    export type Response = base.Consents.show.Response
  }
  export namespace revoke {
    export type Options = (CustomerId | ConnectionId) &
      base.Consents.revoke.Options
    export type Response = base.Consents.revoke.Response
  }
}

export class Consents {
  constructor(private readonly requester: base.Requester) {}

  async list(options: Consents.list.Options): Promise<Consents.list.Response> {
    return this.requester.list({
      url: "/consents",
      query: options,
    })
  }

  async show(options: Consents.show.Options): Promise<Consents.show.Response> {
    return this.requester.show({
      url: "/consents",
      query: options,
      id: "consent_id",
    })
  }

  async revoke(
    options: Consents.revoke.Options,
  ): Promise<Consents.revoke.Response> {
    return this.requester.actionQuery({
      url: "/consents",
      action: "revoke",
      query: options,
      id: "consent_id",
    })
  }
}

export namespace Attempts {
  export type Attributes = base.Attempts.Attributes
  export namespace list {
    export type Options = ConnectionId & base.Attempts.list.Options
    export type Response = base.Attempts.list.Response
  }
  export namespace show {
    export type Options = ConnectionId & base.Attempts.show.Options
    export type Response = base.Attempts.show.Response
  }
}

export class Attempts {
  constructor(private readonly requester: base.Requester) {}

  async list(options: Attempts.list.Options): Promise<Attempts.list.Response> {
    return this.requester.list({
      url: "/attempts",
      query: options,
    })
  }

  async show(options: Attempts.show.Options): Promise<Attempts.show.Response> {
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
    export type Options = (CustomerId | ConnectionId) &
      base.Accounts.list.Options
    export type Response = base.Accounts.list.Response
  }
}

export class Accounts {
  constructor(private readonly requester: base.Requester) {}

  async list(options: Accounts.list.Options): Promise<Accounts.list.Response> {
    return this.requester.list({
      url: "/accounts",
      query: options,
    })
  }
}

export namespace Transactions {
  export type Attributes = base.Transactions.Attributes
  export namespace list {
    export type Options = ConnectionId & base.Transactions.list.Options
    export type Response = base.Transactions.list.Response
  }
  export namespace listDuplicates {
    export type Options = ConnectionId &
      base.Transactions.listDuplicates.Options
    export type Response = base.Transactions.listDuplicates.Response
  }
  export namespace pending {
    export type Options = ConnectionId & base.Transactions.pending.Options
    export type Response = base.Transactions.pending.Response
  }
  export namespace duplicate {
    export type Options = CustomerId & base.Transactions.duplicate.Options
    export type Response = base.Transactions.duplicate.Response
  }
  export namespace unduplicate {
    export type Options = CustomerId & base.Transactions.unduplicate.Options
    export type Response = base.Transactions.unduplicate.Response
  }
  export namespace remove {
    export type Options = CustomerId & base.Transactions.remove.Options
    export type Response = base.Transactions.remove.Response
  }
}

export class Transactions {
  constructor(private readonly requester: base.Requester) {}

  async list(
    options: Transactions.list.Options,
  ): Promise<Transactions.list.Response> {
    return this.requester.list({
      url: "/transactions",
      query: options,
    })
  }

  async listDuplicates(
    options: Transactions.listDuplicates.Options,
  ): Promise<Transactions.listDuplicates.Response> {
    return this.requester.list({
      url: "/transactions/duplicates",
      query: options,
    })
  }

  async pending(
    options: Transactions.pending.Options,
  ): Promise<Transactions.pending.Response> {
    return this.requester.list({
      url: "/transactions/pending",
      query: options,
    })
  }

  async duplicate(
    options: Transactions.duplicate.Options,
  ): Promise<Transactions.duplicate.Response> {
    return this.requester.put({
      url: "/transactions/duplicate",
      data: options,
    })
  }

  async unduplicate(
    options: Transactions.unduplicate.Options,
  ): Promise<Transactions.unduplicate.Response> {
    return this.requester.put({
      url: "/transactions/unduplicate",
      data: options,
    })
  }

  async remove(
    options: Transactions.unduplicate.Options,
  ): Promise<Transactions.unduplicate.Response> {
    return this.requester.request({
      method: "DELETE",
      url: "/transactions",
      body: { data: options },
    })
  }
}
