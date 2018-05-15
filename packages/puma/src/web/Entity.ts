import * as Bookshelf from "bookshelf";
import {
  Collection,
  DestroyOptions,
  FetchAllOptions,
  FetchOptions,
  ModelOptions,
  SortOrder
} from "bookshelf";
import * as Boom from "boom";
import * as Knex from "knex";
import { kebabCase, snakeCase } from "lodash";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { bookshelf, Migration } from "../database";
import { eventBus, store } from "../service";
import { Controller, Delete, Get, Post } from "./Controller";

export type Value =
  | string
  | number
  | boolean
  | Date
  | string[]
  | number[]
  | Date[]
  | boolean[]
  | Buffer
  | Knex.Raw;

export interface EloquentModel {
  get(options?: FetchAllOptions): Promise<Collection<any>>;

  first(options?: FetchOptions): Promise<Collection<any>>;

  select(columns: string | string[]): BModel;

  orderBy(column: string, order?: SortOrder): BModel;

  orderByRaw(sql: string): BModel;

  offset(value: number): BModel;

  skip(value: number): BModel;

  limit(value: number): BModel;

  take(value: number): BModel;

  with(
    withRelated: string,
    singleRelationSubquery?: (query: BModel) => BModel
  ): BModel;

  with(
    withRelated: string[] | { [index: string]: (query: BModel) => BModel }
  ): BModel;

  withSelect(
    relationName: string,
    columns: string | string[],
    subquery?: (query: BModel) => BModel
  ): BModel;

  withCount(
    withRelated: string,
    singleRelationSubquery?: { [index: string]: (query: BModel) => BModel }
  ): BModel;

  withCount(
    withRelated: string[] | { [index: string]: (query: BModel) => BModel }
  ): BModel;

  has(
    relationName: string,
    operator?: string,
    operand1?: number | string,
    operand2?: number | string
  ): BModel;

  orHas(
    relationName: string,
    operator?: string,
    operand1?: number | string,
    operand2?: number | string
  ): BModel;

  whereHas(
    relationName: string,
    subquery?: (query: BModel) => BModel,
    operator?: string,
    operand1?: number | string,
    operand2?: number | string
  ): BModel;

  orWhereHas(
    relationName: string,
    subquery?: (query: BModel) => BModel,
    operator?: string,
    operand1?: number | string,
    operand2?: number | string
  ): BModel;

  destroyAll(options?: DestroyOptions): Promise<any>;

  deleteAll(options?: DestroyOptions): Promise<any>;

  withDeleted(): BModel;

  withTrashed(): BModel;

  fakeSync(options?: FetchOptions): Promise<any>;

  buildQuery(options?: FetchOptions): Promise<any>;

  useTableAlias(alias: string): BModel;

  where(column: string, value: Value | null): BModel;

  where(column: string, operator: string, value: Value | null): BModel;

  where(object: object | ((query: BModel) => BModel)): BModel;

  orWhere(column: string, value: Value | null): BModel;

  orWhere(column: string, operator: string, value: Value | null): BModel;

  orWhere(object: object | ((query: BModel) => BModel)): BModel;

  whereNot(column: string, value: Value | null): BModel;

  whereNot(column: string, operator: string, value: Value | null): BModel;

  whereNot(object: object | ((query: BModel) => BModel)): BModel;

  orWhereNot(column: string, value: Value | null): BModel;

  orWhereNot(column: string, operator: string, value: Value | null): BModel;

  orWhereNot(object: object | ((query: BModel) => BModel)): BModel;

  whereIn(
    column: string,
    values: Value[] | BModel | ((query: BModel) => BModel)
  ): BModel;

  orWhereIn(
    column: string,
    values: Value[] | BModel | ((query: BModel) => BModel)
  ): BModel;

  whereNotIn(
    column: string,
    values: Value[] | BModel | ((query: BModel) => BModel)
  ): BModel;

  orWhereNotIn(
    column: string,
    values: Value[] | BModel | ((query: BModel) => BModel)
  ): BModel;

  whereNull(column: string): BModel;

  orWhereNull(column: string): BModel;

  whereNotNull(column: string): BModel;

  orWhereNotNull(column: string): BModel;

  whereExists(query: BModel | ((query: BModel) => BModel)): BModel;

  orWhereExists(query: BModel | ((query: BModel) => BModel)): BModel;

  whereNotExists(query: BModel | ((query: BModel) => BModel)): BModel;

  orWhereNotExists(query: BModel | ((query: BModel) => BModel)): BModel;

  whereBetween(column: string, range: [Value, Value]): BModel;

  whereBetween(column: string, from: Value, to: Value): BModel;

  orWhereBetween(column: string, range: [Value, Value]): BModel;

  orWhereBetween(column: string, from: Value, to: Value): BModel;

  whereNotBetween(column: string, range: [Value, Value]): BModel;

  whereNotBetween(column: string, from: Value, to: Value): BModel;

  orWhereNotBetween(column: string, range: [Value, Value]): BModel;

  orWhereNotBetween(column: string, from: Value, to: Value): BModel;

  whereLike(column: string, value: string): BModel;

  orWhereLike(column: string, value: string): BModel;

  whereNotLike(column: string, value: string): BModel;

  orWhereNotLike(column: string, value: string): BModel;
}

export interface EloquentCollection {
  add(data: any, options?: ModelOptions): BModel;

  add(data: any[], options?: ModelOptions): BCollection;

  addMemo(data: any, options?: ModelOptions): BModel;

  addMemo(data: any[], options?: ModelOptions): BCollection;

  insert(ignoreDuplicates?: boolean): Promise<BCollection>;

  insertBy(
    uniqueColumns: string | string[],
    selectColumns?: string | string[]
  ): Promise<BCollection>;

  replace(): Promise<BCollection>;
}

export type BCollection = Bookshelf.Collection<any> & EloquentCollection;

export type BModel = Bookshelf.Model<any> & EloquentModel;

export interface IRepository {
  watch;
  watchAll;
  findAll;
  findById;
  upsert;
  remove;
  recover;
  forge;
}

export type Repository = BModel & IRepository;

export function HasOne(...args): PropertyDecorator {
  return (target, propertyKey) => {
    target[propertyKey] = function() {
      return this.hasOne(...args);
    };
  };
}

export function BelongsTo(...args) {
  return (target, propertyKey) => {
    target[propertyKey] = function() {
      return this.belongsTo(...args);
    };
  };
}

export function HasMany(...args) {
  return (target, propertyKey) => {
    target[propertyKey] = function() {
      return this.hasMany(...args);
    };
  };
}

export function BelongsToMany(...args) {
  return (target, propertyKey) => {
    target[propertyKey] = function() {
      return this.belongsToMany(...args);
    };
  };
}

export function Prop(
  callback: (tableBuilder: Knex.CreateTableBuilder) => any
): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    target.props = target.props || {};
    target.props[propertyKey] = callback;
  };
}

function isDisabled(options: any, method: string) {
  return !!options.disable.find(d => d === method);
}

export function Controlled(target) {
  target.findAll = async (request, options: any = {}, trx?) => {
    options = Object.assign({}, target.options, options);
    return (
      target
        .query(q => q.where("deleted", false).orderBy("id"))
        .fetchAll(options.fetch) || []
    );
  };

  target.findById = async (request, options: any = {}, trx?) => {
    options = Object.assign({}, target.options, options);
    const item = await target
      .query(q => q.where("id", request.params.id).orderBy("id"))
      .fetch(options.fetch);

    if (!item) {
      throw Boom.badData(
        `Entity ${target.name} with ID ${request.params.id} not exists`
      );
    }

    return item;
  };

  target.upsert = async (request, options: any = {}, trx?) => {
    const item = request.body;

    if (!item) {
      throw Boom.badData(`Entity ${target.name}, Undefined Body`);
    }

    return target
      .forge(item)
      .save(null, { transacting: trx })
      .catch(trx.rollback);
  };

  target.remove = async (request, options: any = {}, trx?) => {
    const id = request.params.id;

    if (!id) {
      throw Boom.badData(`Entity ${target.name} undefined ID`);
    }

    const old = await target.where("id", id).fetch();

    if (!old) {
      throw Boom.badData(`Entity ${target.name} with ID ${id} not exists`);
    }

    return old
      .save({ deleted_at: new Date() }, { transacting: trx })
      .catch(trx.rollback);
  };

  target.recover = async (request, options: any = {}, trx?) => {
    const item = request.body;

    if (!item) {
      throw Boom.badData(`Entity ${target.name}, Undefined Body`);
    }

    const old = await target.where("id", item.id).fetch();

    if (!old) {
      throw Boom.badData(`Entity ${target.name} with ID ${item.id} not exists`);
    }

    return old
      .save({ deleted_at: null }, { transacting: trx })
      .catch(trx.rollback);
  };

  if (target.options.rest) {
    @Controller({ path: target.path })
    class RestController {
      @Get("/", isDisabled(target.options, "findAll"))
      public async findAll(request) {
        return target.findAll(request);
      }
      @Get("/:id", isDisabled(target.options, "findById"))
      public async findById(request) {
        return target.findById(request);
      }
      @Post("/", isDisabled(target.options, "upsert"))
      public async upsert(request) {
        return target.upsert(request);
      }
      @Delete("/:id", isDisabled(target.options, "remove"))
      public async remove(request) {
        return target.remove(request);
      }
      @Post("/undelete", isDisabled(target.options, "recover"))
      public async recover(request) {
        return target.recover(request);
      }
    }
    target.controller = new RestController();
  }

  return target;
}

export function Reactive(target) {
  target.watch = (query: any = {}): Observable<any> => {
    const subscriptions = [];
    return Observable.create(observer => {
      target
        .where(query)
        .fetch(target.options.fetch)
        .then(data => {
          observer.next(data);
          const listenTo = [target.name, ...target.options.listenTo];
          listenTo.map(l => l.toUpperCase()).forEach(dep => {
            const sub = () =>
              target
                .fetch(target.options.fetch)
                .then(stream => observer.next(stream));
            subscriptions.push(sub);
            eventBus.on(`DB_CHANGE:${dep}`, sub);
          });
        });
    }).pipe(
      finalize(() => subscriptions.forEach(s => eventBus.unsubscribe(s)))
    );
  };

  target.watchAll = (query: any = {}): Observable<any> => {
    const subscriptions = [];
    return Observable.create(observer => {
      target
        .where(query)
        .fetchAll(target.options.fetch)
        .then(data => {
          observer.next(data);
          const listenTo = [target.name, ...target.options.listenTo];
          listenTo.map(l => l.toUpperCase()).forEach(dep => {
            const sub = () =>
              target
                .fetchAll(target.options.fetch)
                .then(stream => observer.next(stream));
            subscriptions.push(sub);
            eventBus.on(`DB_CHANGE:${dep}`, sub);
          });
        });
    }).pipe(
      finalize(() => subscriptions.forEach(s => eventBus.unsubscribe(s)))
    );
  };

  if (target.options.sse) {
    @Controller({ path: `/sse${target.path}` })
    class SseController {
      @Get("/")
      public watchAll(request, reply) {
        target.watchAll().subscribe(data => {
          (reply as any).sse(data);
        });
      }
      @Get("/:id")
      public watch(request, reply) {
        const id = request.params.id;
        if (!id) {
          throw Boom.badData(`Entity ${target.name} undefined ID`);
        }
        target.watch({ id }).subscribe(data => {
          (reply as any).sse(data);
        });
      }
    }

    target.sseController = new SseController();
  }

  if (target.options.ws) {
    const ws = store.get("io");
    @Controller({ path: `/ws${target.path}` })
    class WsController {
      @Get("/")
      public watchAll(request, reply) {
        target.watchAll().subscribe(data => {
          ws.emit(target.name, data);
          reply.send({ ok: true });
        });
      }
      @Get("/:id")
      public watch(request, reply) {
        const id = request.params.id;
        if (!id) {
          throw Boom.badData(`Entity ${target.name} undefined ID`);
        }
        target.watch({ id }).subscribe(data => {
          ws.emit(`${target.name}/${id}`, data);
          reply.send({ ok: true });
        });
      }
    }
    target.wsController = new WsController();
  }

  return target;
}

export function Migrated(target) {
  // TODO: check tableName origin
  target.migration = new Migration(
    knex => {
      return knex.schema.createTable(target.tableName, table => {
        table.increments();
        table.timestamps(true, true);
        table.timestamp("deleted_at");

        Object.keys(target.props).forEach(key => {
          const prop = target.props[key];
          prop(table);
        });
      });
    },
    knex => knex.schema.dropTableIfExists(target.tableName)
  );
}

export interface RepositoryOptions {
  fetch: Partial<Bookshelf.FetchOptions & Bookshelf.FetchAllOptions>;
  listenTo: string[];
  disable: string[];
}

export interface RepositoryParameter {
  path: string;
  options: Partial<RepositoryOptions>;
  hidden: string[];
}

const defaults = {
  disable: [],
  rest: true,
  sse: false,
  ws: true
};

export interface IEntity {
  controller: Controller;
  wsController: Controller;
}

export type Entity = Repository & IEntity;

export function Repository({
  path,
  hidden,
  options
}: Partial<RepositoryParameter> = {}): ClassDecorator {
  return target => {
    const name = target.name.split("Repository")[0];
    const tableName = snakeCase(name);
    const props = {
      initialize() {
        this.on("created", m => {
          eventBus.emit(`DB_CHANGE:${name.toUpperCase()}`);
        });
        this.on("updated", m => {
          eventBus.emit(`DB_CHANGE:${name.toUpperCase()}`);
        });
        this.on("destroyed", m => {
          eventBus.emit(`DB_CHANGE:${name.toUpperCase()}`);
        });
      },
      tableName,
      hidden,
      softDelete: true
    };

    Object.keys(target.prototype).forEach(key => {
      props[key] = target.prototype[key];
    });

    let model = bookshelf.model(name, props);
    model.path = `/${kebabCase(name)}` || path;
    model.options = Object.assign({}, defaults, options);

    const f: any = () => {
      return model;
    };

    Object.defineProperty(f, "name", { value: target.name });

    model = Reactive(Controlled(model));

    return f;
  };
}
