//jshint esversion:6
const mongoose = require("mongoose");

///////8888888888888888 SCHEMA 8888888888888///////////
const itemsSchema = {
  _id: mongoose.Schema.Types.ObjectId,
  ItemID: String,
  ItemDescription: String,
  Inactive: String,
  DescriptionforSales: String,
  DescriptionforPurchases: String,
  SalesPrice1: String,
  SalesPrice2: String,
  SalesPrice3: String,
  LastUnitCost: String,
  ItemType: String,
  StockingUM: String,
  Weight: String,
  MinimumStock: String,
  ReorderQuantity: String,
  VendorID: String,
  QuantityonSalesOrders: String,
  QuantityonPurchaseOrders: String,
  QuantityOnHand: String,
  QuantityNeeded: String
}
const soldSchema = {
  _id: mongoose.Schema.Types.ObjectId,
  ItemType: String,
  ItemID: String,
  ItemDescription: String,
  DescriptionforSales: String,
  DescriptionforPurchases: String,
  BegQty: Number,
  UnitsSold: Number,
  UnitsPurc: Number,
  AdjustQty: Number,
  QtyonHand: Number,
  Date: Date
}
const orderSchema = {
  _id: mongoose.Schema.Types.ObjectId,
  PONo: String,
  PODate: Date,
  POState: String,
  ItemID: String,
  LineDescription: String,
  LineDescforSales: String,
  LineDescforPurch: String,
  QtyOrdered: Number,
  QtyReceived: Number,
  QtyRemaining: Number,
  VendorID: String,
  Date: Date
}

var Item;
var Sold;
var OnOrder;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

const LoadDB = function() { //REFACTOR ME TO MAKE PROMISE WORK RIGHT mongodb+srv://Admin:Royalty99@orderist-33pfq.mongodb.net/orderdb?retryWrites=true
  return new Promise(function(resolve, reject) {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect('mongodb+srv://AppLogin:vnLi9mNkyRt6mDjV@clusterfree-33pfq.mongodb.net/orderdb?retryWrites=true', options).catch((err) => {
        console.log(err.stack); //"Error Connecting to the Mongodb Database"
      });

      if (mongoose.connection.readyState === 0) {
        // console.log("UN-Succesfully Connected to the Mongodb Database");
        reject("UN-Succesfully Connected to the Mongodb Database");
      } else {
        // console.log("Database", mongoose.connections[0].name);
        // console.log("Succesfully Connected to the Mongodb Database");
        resolve(null, "Succesfully Connected to the Mongodb Database");
      }
    } else {
      console.log("Already connected");
    }

  });
};




module.exports = {


  BeginServer: function() {
    return new Promise(async function(resolve, reject) {
      LoadDB().then(function(err, msg) {
        if (err) {
          console.log("LoadDB Err", err);
        } else {

        }
      });
    });
  } //BeginServer
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function DateHelper(date, callback) {
  const d = date.getDate() + months[date.getMonth() + 1] + date.getFullYear();
  // console.log("date", date, "d", d);
  callback(d);
}

const DBLoadItem = function() {
  return new Promise(function(resolve, reject) {
    Item = mongoose.model("items", itemsSchema);
    if (Item.length > 0) {
      console.log("Item", Item.length);
      resolve("[Item Loaded]");
    } else {
      reject("[Loaded items Failed]");
    }
  });
}
const DBLoadSold = function() {
  return new Promise(function(resolve, reject) {
    Sold = mongoose.model("solditems", soldSchema);
    if (Sold.length > 0) {
      console.log("Sold", Sold.length);
      resolve("[Sold Loaded]");
    } else {
      reject("[Loaded sold Failed]");
    }
  });
}
const DBLoadOnOrder = function() {
  return new Promise(function(resolve, reject) {
    OnOrder = mongoose.model("orderitems", orderSchema);
    if (OnOrder.length > 0) {
      console.log("OnOrder", OnOrder.length);
      resolve("[OnOrder Loaded]");
    } else {
      reject("[Loaded orders Failed]");
    }
  });
}
