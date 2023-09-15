type Factor = "network" | "specs" | "cost" | "performance";

interface InitOptions {
  baseUrl?: string;
  weights?: {
    [key: Factor]: number;
  };
  headers?: Object;
  body?: Object;
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

type RegisteredFunction {
  (...args: any[]): Promise<any>
  runLocal: Function
  runRemote: Promise<any>
}