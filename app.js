//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const DBInfo = require(__dirname + "/data.js");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

var faker = [];

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Sever started Successfully");

  DBInfo.BeginServer().then(result => {
    console.log("************* Startup start *************");
    console.log("fillSizeList", DBInfo.fillSizeList.length);
    console.log("vendorList", DBInfo.vendorList.length);
    console.log("orderNumList", DBInfo.orderNumList.length);
    console.log("typeList", DBInfo.typeList.length);
    console.log("************* Startup End *************");
  });

  // for (var i = 0; i < 50; i++) {
  //   const tempVar = {
  //     c1: "c" + i,
  //     c2: "c" + i,
  //     c3: "c" + i,
  //     c4: "c" + i,
  //     c5: "",
  //     c6: ""
  //   }
  //   console.log("tempVar", tempVar);
  //
  //   faker.push(tempVar);
  // }
  // console.log("Faker Done", faker);
});











const dataBlock = {
  mainTitle: "Sample Title",
  exHeader: {
    h1: "Header1",
    h2: "Header2",
    h3: "Header3",
    h4: "Header4",
    h5: "",
    h6: ""
  },
  exInfo: faker,

  b1Title: "My Title",
  b1Header: {
    h1: "Header1",
    h2: "Header2",
    h3: "Header3",
    h4: "Header4",
  },
  b1Total: 5,
  b1Pageination: -1,
  b1Info: faker,

  b2Title: "Na",
  b2Header: {
    h1: "Header1",
    h2: "Header2",
    h3: "Header3",
    h4: "Header4",
  },
  b2Total: 5,
  b2Pageination: -1,
  b2Info: faker
}

var b1_PageNum = 0;
var b2_PageNum = 0;

//***************************************************
//
//
//
//***************************************************
function BreakItDown(collection, section, callback) {
  const stop = section * 10;
  const start = stop - 10;
  const slice = collection.slice(start, stop);
  callback(slice);
}

//***************************************************
//
//
//
//***************************************************
var doOnce = true;
app.get("/", function(req, res) {
  // console.log("dataBlock.b1Header.length", dataBlock.b1Header);
  if (doOnce) {
    var slice = [];
    BreakItDown(faker, 1, function(val) {
      slice = val;
    });
    dataBlock.b1Info = slice;
    dataBlock.b2Info = slice;
    doOnce = false;
  }
  // dataBlock.b1Total = Math.ceil(faker.length/10),
  // dataBlock.b2Total = Math.ceil(faker.length/10),


  // console.log("dataBlock.b1Total", dataBlock.b1Total);

  res.render("display.ejs", {
    dataBlock: dataBlock
  });
});

//***************************************************
//
//
//
//***************************************************
app.get("/display/:sort", function(req, res) {
  const sort = req.params.sort;
  var right = 0;
  const idx = sort.indexOf(".");
  const left = sort.substring(0, idx);

  // if (sort.includes("Prev")) {
  //   right = Number(b1_Pageination) - 1;
  // } else if (sort.includes("Next")) {
  //   right = Number(b1_Pageination) + 1;
  // } else {
  //   right = Number(sort.substring(idx + 1, sort.length));
  // }


  if (left === "1") {
    if (sort.includes("Prev")) {
      right = b1_PageNum - 1;
    } else if (sort.includes("Next")) {
      right = b1_PageNum + 1;
    } else {
      right = Number(sort.substring(idx + 1, sort.length));
    }

    b1_PageNum = Number(right);
    BreakItDown(faker, right, function(val) {
      dataBlock.b1Info = val;
    });

    if (right === 1) {
      dataBlock.b1Pageination = -1;
    } else if (right === dataBlock.b1Total) {
      dataBlock.b1Pageination = 1;
    } else {
      dataBlock.b1Pageination = 0;
    }

    res.redirect("back");
  } else {
    if (sort.includes("Prev")) {
      right = b2_PageNum - 1;
    } else if (sort.includes("Next")) {
      right = b2_PageNum + 1;
    } else {
      right = Number(sort.substring(idx + 1, sort.length));
    }

    b2_PageNum = Number(right);
    BreakItDown(faker, right, function(val) {
      dataBlock.b2Info = val;
    });

    // console.log("TypeOf R", right);
    // console.log("TypeOf Total", dataBlock.b2Total);

    if (right === 1) {
      dataBlock.b2Pageination = -1;
    } else if (right === dataBlock.b2Total) {
      dataBlock.b2Pageination = 1;
    } else {
      dataBlock.b2Pageination = 0;
    }

    res.redirect("back");
  }
});

//***************************************************
//
//
//
//***************************************************
app.get("/orders", function(req, res){

  const orderList = DBInfo.orderNumList.slice();
  var info = [];
  BreakItDown(orderList, 1, function(val) {
    info = val;
  });


  dataBlock.mainTitle= "Purchase Orders";
  dataBlock.exHeader= null;
  dataBlock.exInfo= null;

  dataBlock.b1Title= "My Title";
  dataBlock.b1Header= {
    h1: "PO#",
    h2: "PODate",
    h3: "State",
    h4: "Vendor",
    h5: "Date"
  };
  dataBlock.b1Total= Math.ceil(orderList.length);
  dataBlock.b1Pageination= -1;
  dataBlock.b1Info= info;

  res.redirect("back");
});
