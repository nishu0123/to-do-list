// require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
    // const port = 3000

const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash')

mongoose.connect("mongodb+srv://admin:2000@cluster0.wgubynj.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// var items = ["Apple", "Ball"];
// var workItems = [];

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your To-Do-List"
})

const item2 = new Item({
    name: "Hit + to add new Item"
})

const item3 = new Item({
    name: "Hit Checkbox to Delete"
})

const defaultItems = [item1, item2, item3];

const listsSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listsSchema);

app.get('/', (req, res) => {
    const temp = date.getDay();

    Item.find({}, (err, foundItems) => {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Data Successfully Inserted");
                    }
                })
                res.redirect('/')
            }
            res.render('list', { listTitle: temp, newListItems: foundItems })
        }
    })


})

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                // console.log("Doesn't exits");
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })

                list.save();

                res.render('list', { listTitle: list.name, newListItems: list.items })

            } else {
                // console.log("List Exist");
                res.render('list', { listTitle: foundList.name, newListItems: foundList.items })
            }
        }
    })
})

app.post('/', (req, res) => {
    // console.log(req.body);
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    })

    if (listName === date.getDay()) {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(foundList);
                foundList.items.push(item);
                foundList.save();
                res.redirect(`/${foundList.name}`);
            }
        })

    }

})

app.post('/find', (req, res) => {
    const customListName = req.body.newListName;
    // console.log(customListName);
    res.redirect(`/${customListName}`); // Was Getting Error Here

})

app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === date.getDay()) {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) console.log(err);
            else {
                console.log("Data Successfully removed")
                res.redirect('/')
            }
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Item deleted successfully from " + listName);
                // res.redirect(`/${listName}`);
                res.redirect("/" + listName);
            }
        })
    }



})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log(`Server has started successfully on port ${port}`)
})


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://caytus:<password>@cluster0.tvxfa8h.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });