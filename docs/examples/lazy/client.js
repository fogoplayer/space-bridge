import lazy from "space-bridge";

const [{ sum, subtract }, downloadLibrary] = lazy(
  () => import("./library.js"),
  {
    methods: [
      "sum",
      {
        name: "subtract",
        args: [
          { name: "number1", type: Number },
          { name: "number2", type: Number },
        ],
        returnType: Number,
      },
    ],
  }
);

const total = await sum(3.14, 6.28); // runs on server

await downloadLibrary();

const difference = await subtract(6.28, 3.14); // could run locally
