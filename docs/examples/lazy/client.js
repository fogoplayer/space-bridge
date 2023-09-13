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

const total = await sum.runRemote(3.14, 6.28);
const total = await sum(3.14, 6.28); // equivalent before download

try {
  const localTotal = await sum.runLocal(3.14, 6.28);
} catch (e) {
  // runLocal is not defined before download
}

await downloadLibrary();

const localDifference = await subtract.runLocal(6.28, 3.14);
const serverDifference = await subtract.runRemote(6.28, 3.14);
const balancedDifference = await subtract(6.28, 3.14);
