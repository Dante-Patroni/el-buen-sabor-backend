const swaggerSpec = require("./src/docs/swagger");

const fs = require("fs");

fs.writeFileSync("swagger.json", JSON.stringify(swaggerSpec, null, 2));

console.log("Swagger JSON generado en swagger.json");