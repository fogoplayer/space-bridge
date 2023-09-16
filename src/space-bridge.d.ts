type Factor = "network" | "specs" | "cost" | "performance";

interface InitOptions {
  baseUrl: string;
  weights: {
    [key in Factor]: number;
  };
  headers: Object;
  body: Object;
}

type DefineOptions = InitOptions & {
  url: string;
};

type Schema = MethodSchema | MemberSchema;

type MethodSchema = {
  name: string; // function or member name
  args: Schema[];
  returnType: Function; // class name like Object or MyClass
};

type MemberSchema = {
  name: string;
  type: Function; // class name like Object or MyClass
};

type SpaceBridgeOptions = {
  prefix: string; // a prefix for the spacebridge API endpoints
  stats: boolean; // if false, GET and PUT requests return a 404
};

type Callable = (...args: any[]) => any;

type PromiseWrappedFunction<T extends Callable = Callable> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>;

type BridgedFunction<T extends Callable = Callable> =
  PromiseWrappedFunction<T> & {
    runLocal: T;
    runRemote: PromiseWrappedFunction<T>;
  };
