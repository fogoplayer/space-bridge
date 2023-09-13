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
