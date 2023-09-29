const http = require("http");
const fs = require("fs");
const url = require("url");
const html = fs.readFileSync("./Template/index.html", "utf-8");
const productsList = JSON.parse(
  fs.readFileSync("./Template/Data/Products.json", "utf-8")
);
const productsListHtml = fs.readFileSync(
  "./Template/Products-List.html",
  "utf-8"
);
const productDetailsHtml = fs.readFileSync(
  "./Template/ProductDetailsHtml.html",
  "utf-8"
);
// let updatedProductsList = productsList.map((eachProduct) => {});

function replaceHtml(template, product) {
  let output = template.replace("{{%IMAGE%}}", product.productImage);
  output = output.replace("{{%NAME%}}", product.name);
  output = output.replace("{{%MODELNAME%}}", product.modeName);
  output = output.replace("{{%MODELNO%}}", product.modelNumber);
  output = output.replace("{{%SIZE%}}", product.size);
  output = output.replace("{{%CAMERA%}}", product.camera);
  output = output.replace("{{%PRICE%}}", product.price);
  output = output.replace("{{%COLOR%}}", product.color);
  output = output.replace("{{%ID%}}", product.id);
  output = output.replace("{{%ROM%}}", product.ROM);
  output = output.replace("{{%DESC%}}", product.Description);

  return output;
}

const server = http.createServer((request, response) => {
  let { query, pathname: path } = url.parse(request.url, true);
  // let path = request.url;

  if (path === "/" || path.toLocaleLowerCase() === "/home") {
    response.end(html.replace("{{%context%}}", "You are In Home Page"));
  } else if (path.toLocaleLowerCase() === "/about") {
    response.end(html.replace("{{%context%}}", "You are In About Page"));
  } else if (path.toLocaleLowerCase() === "/contact") {
    response.end(html.replace("{{%context%}}", "You are In Contact Page"));
  } else if (path.toLocaleLowerCase() === "/products") {
    if (!query.id) {
      let updatedProductsList = productsList.map((eachProduct) => {
        return replaceHtml(productsListHtml, eachProduct);
      });
      let displayProductsListHtml = html.replace(
        "{{%context%}}",
        updatedProductsList.join(",")
      );
      response.end(displayProductsListHtml);
      // response.end({ productsList });
      // console.log(productsListHtml);}
    } else {
      let prod = productsList[query.id];
      let productDisplayHtml = replaceHtml(productDetailsHtml, prod);
      response.end(html.replace("{{%context%}}", productDisplayHtml));
    }
  } else {
    response.end("Error: 404 Page Not Found");
  }
});

server.listen(8001, "127.0.0.1", () => {
  console.log("Server has Been Started");
});
