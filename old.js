"use strict";
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}
var url = window.location.href;
var uri = new URL(url);
var secondary = firebase.initializeApp({
    "apiKey": "AIzaSyAHj06xiK6QFuGIwCp-I9UYeGdH9TsuFNQ",
    "authDomain": "prosourcelend.firebaseapp.com",
    "databaseURL": "https://prosourcelend.firebaseio.com",
    "messagingSenderId": "798405902487",
    "projectId": "prosourcelend",
    "storageBucket": "prosourcelend.appspot.com"
}, "secondary");
var uid = uri.searchParams.get("id");
var updated = false;
var db = firebase.firestore();
var rates = {
    "EURUSD": "0",
    "AUDUSD": "0",
    "GBPUSD": "0",
    "NZDUSD": "0",
    "XAUUSD": "0",
    "XAGUSD": "0"
};
db.collection("rates").doc("all").onSnapshot(function(doc) {
    rates["EURUSD"] = doc.data().EURUSD;
    rates["AUDUSD"] = doc.data().AUDUSD;
    rates["GBPUSD"] = doc.data().GBPUSD;
    rates["NZDUSD"] = doc.data().NZDUSD;
    rates["XAUUSD"] = doc.data().XAUUSD;
    rates["XAGUSD"] = doc.data().XAGUSD;
    if (firebase.auth().currentUser)
        setupTables()
});
var userRef = id != "new" ? db.collection("users").doc(uid) : null;
function setupFields() {
    if (uid != "new") {
        userRef.get().then(function(doc) {
            document.getElementById("balance").innerHTML = formatNum(doc.data().balance);
            document.getElementById("name").value = doc.data().name;
            document.getElementById("number").value = doc.data().phone;
            document.getElementById("id").value = doc.data().id;
            document.getElementById("address").value = doc.data().address;
            document.getElementById("city").value = doc.data().city;
            document.getElementById("state").value = doc.data().state;
            document.getElementById("postal").value = doc.data().postal;
            document.getElementById("country").value = doc.data().country;
            document.getElementById("city").value = doc.data().city;
            document.getElementById("new-user").style.display = "none";
            document.getElementById("open-transactions").style.display = "inherit";
            document.getElementById("deposit-list").style.display = "inherit"
        })
    } else {
        document.getElementById("update").setAttribute("open", "");
        document.getElementById("new-user").style.display = "inherit";
        document.getElementById("email").value = "";
        document.getElementById("password").value = ""
    }
}
function updateInfo() {
    document.getElementById("message").innerHTML = "Saving...";
    if (uid != "new") {
        userRef.update(_defineProperty({
            "name": document.getElementById("name").value,
            "phone": document.getElementById("number").value,
            "id": document.getElementById("id").value,
            "address": document.getElementById("address").value,
            "city": document.getElementById("city").value,
            "state": document.getElementById("state").value,
            "postal": document.getElementById("postal").value,
            "country": document.getElementById("country").value
        }, "city", document.getElementById("city").value)).then(function() {
            document.getElementById("message").innerHTML = "Saved!"
        })["catch"](function(err) {
            document.getElementById("message").innerHTML = "Something went wrong.";
            console.error(err)
        })
    } else {
        secondary.auth().createUserWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value).then(function(user) {
            var _userRef$set;
            userRef = db.collection("users").doc(secondary.auth().currentUser.uid);
            uid = secondary.auth().currentUser.uid;
            refreshUser();
            userRef.set((_userRef$set = {
                "name": document.getElementById("name").value,
                "phone": document.getElementById("number").value,
                "id": document.getElementById("id").value,
                "address": document.getElementById("address").value,
                "city": document.getElementById("city").value,
                "state": document.getElementById("state").value,
                "postal": document.getElementById("postal").value,
                "country": document.getElementById("country").value
            },
            _defineProperty(_userRef$set, "city", document.getElementById("city").value),
            _defineProperty(_userRef$set, "balance", 0),
            _defineProperty(_userRef$set, "admin", false),
            _userRef$set)).then(function() {
                document.getElementById("message").innerHTML = "User created!";
                setupFields();
                setupTables();
                setupDeposits();
                setupArchives();
                document.getElementById("open-transactions").style.display = "inherit";
                document.getElementById("deposit-list").style.display = "inherit";
                secondary.auth().signOut()
            })["catch"](function(err) {
                document.getElementById("message").innerHTML = "Something went wrong.";
                console.error(err)
            })
        })["catch"](function(err) {
            document.getElementById("message").innerHTML = "Something went wrong.";
            console.error(err)
        })
    }
    return false
}
function showTransaction() {
    document.getElementById("new-transaction").style.display = "inherit";
    updateBsPrice()
}
function showDeposit() {
    document.getElementById("new-deposit").style.display = "inherit"
}
function createDeposit() {
    var date = document.getElementById("deposit-date").valueAsDate;
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    userRef.collection("deposits").add({
        "date": firebase.firestore.Timestamp.fromDate(date),
        "amount": parseFloat(document.getElementById("deposit-amount").value),
        "committed": false
    }).then(function() {
        setupDeposits()
    })["catch"](function() {
        document.getElementById("dmessage").innerHTML = "Something went wrong."
    });
    return false
}
function setupDeposits() {
    var table = document.getElementById("deposit-body");
    var depRef = userRef.collection("deposits");
    depRef.get().then(function(querySnapshot) {
        table.innerHTML = "";
        querySnapshot.forEach(function(doc) {
            table.innerHTML += "\n                <tr id=\"".concat(doc.id, "\">\n                    <td id=\"ddate\" date=\"").concat(doc.data().date.toDate(), "\">").concat(formatDate(doc.data().date.toDate()), "</td>\n                    <td id=\"damount\" amount=\"").concat(doc.data().amount, "\">").concat(formatNum(doc.data().amount), "</td>\n                    <td id=\"doptions\">").concat(doc.data().committed ? "<a href=\"#/\" onclick=\"editDeposit('".concat(doc.id, "')\">Edit</a>/<a href=\"#/\" onclick=\"deleteDeposit('").concat(doc.id, "')\">Delete</a>") : "<a href=\"#/\" onclick=\"editDeposit('".concat(doc.id, "')\">Edit</a>/<a href=\"#/\" onclick=\"commitDeposit('").concat(doc.id, "')\">Commit</a>/<a href=\"#/\" onclick=\"deleteDeposit('").concat(doc.id, "')\">Delete</a>"), "</td>\n                </tr>")
        })
    })["catch"](function(error) {
        console.log("Error getting deposits: ", error)
    })
}
function editDeposit(id) {
    var deposit = document.getElementById(id);
    var date = deposit.querySelector("#ddate");
    date.innerHTML = "<input id=\"field\" type=\"date\" />";
    date.querySelector("#field").valueAsDate = new Date(date.getAttribute("date"));
    var amount = deposit.querySelector("#damount");
    amount.innerHTML = "<input id=\"field\" type=\"number\" value=\"".concat(parseInt(amount.getAttribute("amount")), "\" />");
    deposit.querySelector("#doptions").innerHTML = "<a href=\"#/\" onclick=\"commitChanges('".concat(id, "')\">Save</a>");
    return false
}
function commitChanges(id) {
    var depositRef = userRef.collection("deposits").doc(id);
    var deposit = document.getElementById(id);
    var date = deposit.querySelector("#ddate").querySelector("#field").valueAsDate;
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    depositRef.get().then(function(dep) {
        depositRef.update({
            "date": firebase.firestore.Timestamp.fromDate(date),
            "amount": parseInt(deposit.querySelector("#damount").querySelector("#field").value)
        }).then(function() {
            if (dep.data().committed) {
                userRef.get().then(function(doc) {
                    userRef.update({
                        "balance": doc.data().balance + (parseInt(deposit.querySelector("#damount").querySelector("#field").value) - dep.data().amount)
                    })["catch"](function(err) {
                        alert("Something went wrong: 3");
                        console.error(err)
                    })
                }).then(function() {
                    setupDeposits()
                })["catch"](function(err) {
                    alert("Something went wrong: 0x2");
                    console.error(err)
                })
            }
        })["catch"](function(err) {
            alert("Something went wrong: 1");
            console.error(err)
        })
    })["catch"](function(err) {
        alert("Something went wrong: 0");
        console.error(err)
    });
    return false
}
function commitDeposit(id) {
    var depositRef = userRef.collection("deposits").doc(id);
    depositRef.get().then(function(dep) {
        userRef.get().then(function(doc) {
            userRef.update({
                "balance": doc.data().balance + parseFloat(dep.data().amount)
            }).then(function() {
                depositRef.update({
                    "committed": true
                }).then(function() {
                    setupDeposits()
                })["catch"](function(err) {
                    alert("Something went wrong: 3")
                })
            })["catch"](function(err) {
                alert("Something went wrong: 2")
            })
        })["catch"](function(err) {
            alert("Something went wrong: 0x1")
        })
    })["catch"](function(err) {
        alert("Something went wrong: 0")
    });
    return false
}
function deleteDeposit(id) {
    var depositRef = userRef.collection("deposits").doc(id);
    depositRef.get().then(function(dep) {
        if (dep.data().committed) {
            depositRef["delete"]().then(function() {
                userRef.get().then(function(doc) {
                    userRef.update({
                        "balance": doc.data().balance - dep.data().amount
                    }).then(function() {
                        setupDeposits()
                    })["catch"](function(err) {
                        alert("Something went wrong: 3")
                    })
                })["catch"](function(err) {
                    alert("Something went wrong: 2")
                });
                setupDeposits()
            })["catch"](function(err) {
                alert("Something went wrong: 1")
            })
        } else {
            depositRef["delete"]().then(function() {
                setupDeposits()
            })["catch"](function(err) {
                alert("Something went wrong: 0x0")
            })
        }
    })["catch"](function(err) {
        alert("Something went wrong: 0")
    });
    return false
}
function updateBsPrice() {
    document.getElementById("bsprice").value = rates[document.getElementById("currency").options[document.getElementById("currency").selectedIndex].value]
}
function createTransaction() {
    document.getElementById("create-transaction").setAttribute("disabled", "");
    userRef.collection("transactions").add({
        "bsprice": parseFloat(document.getElementById("bsprice").value),
        "currency": document.getElementById("currency").options[document.getElementById("currency").selectedIndex].value,
        "bs": document.getElementById("buysell").options[document.getElementById("buysell").selectedIndex].value == "buy",
        "leverage": parseInt(document.getElementById("leverage").value),
        "ticket": document.getElementById("ticket").value,
        "openDate": firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() {
        document.getElementById("ntmessage").innerHTML = "";
        document.getElementById("new-transaction").style.visibility = "none";
        setupTables();
        setupArchives();
        document.getElementById("leverage").value = "";
        document.getElementById("ticket").value = "";
        document.getElementById("create-transaction").removeAttribute("disabled")
    })["catch"](function(err) {
        document.getElementById("ntmessage").innerHTML = "Something went wrong."
    });
    return false
}
function setupTables() {
    var table = document.getElementById("open-body");
    var userRef = db.collection("users").doc(uid);
    var transRef = userRef.collection("transactions");
    var pl = 0;
    // Get open transactions.
    transRef.get().then(function(querySnapshot) {
        // Clear the tables.
        table.innerHTML = "";
        querySnapshot.forEach(function(doc) {
            document.getElementById("opened-tables").style.display = "";
            var pip = doc.data().bs ? rates[doc.data().currency] - doc.data().bsprice : doc.data().bsprice - rates[doc.data().currency];
            var metal = doc.data().currency == "XAUUSD" || doc.data().currency == "XAGUSD";
            table.innerHTML += "\n                <tr id=\"tr-".concat(doc.id, "\">\n                    <td class=\"pure-form\" id=\"tr-date\">").concat(formatDate(doc.data().openDate.toDate()), "</td>\n                    <td class=\"pure-form\" id=\"tr-ticket\">").concat(doc.data().ticket, "</td>\n                    <td class=\"pure-form\" id=\"tr-currency\">").concat(doc.data().currency.slice(0, 3), "/").concat(doc.data().currency.slice(3), "</td>\n                    <td class=\"pure-form\" id=\"tr-leverage\">").concat(formatNum(doc.data().leverage, metal)).concat(metal ? " oz" : "", "</td>\n                    <td class=\"pure-form\" id=\"tr-bs\"><strong>").concat(doc.data().bs ? "B" : "S", "</strong> ").concat(doc.data().bsprice, "</td>\n                    <td class=\"pure-form\" id=\"tr-pl\" class=\"").concat(doc.data().leverage * pip < 0 ? "neg" : "pos", "\">").concat(doc.data().leverage * pip < 0 ? "" : "+").concat(formatNum(doc.data().leverage * pip), "</td>\n                    <td class=\"pure-form\" id=\"tr-current\"><strong>").concat(doc.data().bs ? "S" : "B", "</strong> ").concat(rates[doc.data().currency], "</td>\n                    <td class=\"pure-form\" id=\"tr-options\"><a href=\"#/\" onclick=\"editTransaction('").concat(doc.id, "')\">Edit</a>/<a href=\"#/\" onclick=\"archivePrompt('").concat(doc.id, "')\">Close</a>/<a href=\"#/\" onclick=\"deleteTransaction('").concat(doc.id, "')\">Delete</a></td>\n                </tr>");
            pl += doc.data().leverage * pip
        })
    })["catch"](function(error) {
        console.log("Error getting documents: ", error)
    })
}
function editTransaction(id) {
    updating = true;
    var transaction = document.getElementById("tr-".concat(id));
    userRef.collection("transactions").doc(id).get().then(function(doc) {
        transaction.querySelector("#tr-date").innerHTML = "<input id=\"trf-date\" type=\"date\" />";
        transaction.querySelector("#trf-date").valueAsDate = doc.data().openDate.toDate();
        transaction.querySelector("#tr-ticket").innerHTML = "<input id=\"trf-ticket\" type=\"text\" value=\"".concat(doc.data().ticket, "\" />");
        transaction.querySelector("#tr-currency").innerHTML = "\n        <select id=\"trf-currency\" required>\n            <option value=\"EURUSD\"".concat(transaction.querySelector("#tr-currency").innerHTML == "EUR/USD" ? " selected" : "", ">EUR/USD</option>\n            <option value=\"GBPUSD\"").concat(transaction.querySelector("#tr-currency").innerHTML == "GBP/USD" ? " selected" : "", ">GBP/USD</option>\n            <option value=\"AUDUSD\"").concat(transaction.querySelector("#tr-currency").innerHTML == "AUD/USD" ? " selected" : "", ">AUD/USD</option>\n            <option value=\"NZDUSD\"").concat(transaction.querySelector("#tr-currency").innerHTML == "NZD/USD" ? " selected" : "", ">NZD/USD</option>\n            <option value=\"XAUUSD\"").concat(transaction.querySelector("#tr-currency").innerHTML == "XAU/USD" ? " selected" : "", ">XAU/USD</option>\n            <option value=\"XAGUSD\"").concat(transaction.querySelector("#tr-currency").innerHTML == "XAG/USD" ? " selected" : "", ">XAG/USD</option>\n        </select>");
        transaction.querySelector("#tr-leverage").innerHTML = "<input id=\"trf-leverage\" type=\"number\" value=\"".concat(doc.data().leverage, "\" />");
        transaction.querySelector("#tr-bs").innerHTML = "<input id=\"trf-bs\" type=\"text\" value=\"".concat(doc.data().bsprice, "\" />");
        transaction.querySelector("#tr-pl").innerHTML = "\n        <select id=\"trf-pl\">\n            <option value=\"BUY\"".concat(doc.data().bs ? " selected" : "", ">BUY</option>\n            <option value=\"SELL\"").concat(doc.data().bs ? "" : " selected", ">SELL</option>\n        </select>");
        transaction.querySelector("#tr-options").innerHTML = "<a href=\"#/\" onclick=\"saveTransaction('".concat(id, "')\">Save</a>/<a href=\"#/\" onclick=\"setupTables()\">Cancel</a>")
    })["catch"](function(err) {
        updating = false;
        alert("Something went wrong: 0");
        console.error(err)
    })
}
function saveTransaction(id) {
    var transaction = document.getElementById("tr-".concat(id));
    var date = transaction.querySelector("#trf-date").valueAsDate;
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    userRef.collection("transactions").doc(id).update({
        "openDate": firebase.firestore.Timestamp.fromDate(date),
        "ticket": transaction.querySelector("#trf-ticket").value,
        "currency": transaction.querySelector("#trf-currency").options[transaction.querySelector("#trf-currency").selectedIndex].value,
        "leverage": parseInt(transaction.querySelector("#trf-leverage").value),
        "bsprice": parseFloat(transaction.querySelector("#trf-bs").value),
        "bs": transaction.querySelector("#trf-pl").selectedIndex == 0
    }).then(function() {
        setupTables()
    })["catch"](function(err) {
        alert("Something went wrong: 0");
        console.error(err)
    })
}
function editArchive(id) {
    updating = true;
    var archive = document.getElementById("ar-".concat(id));
    userRef.collection("archives").doc(id).get().then(function(doc) {
        archive.querySelector("#ar-date").innerHTML = "<input id=\"arf-date\" type=\"date\" />";
        archive.querySelector("#arf-date").valueAsDate = doc.data().openDate.toDate();
        archive.querySelector("#ar-closedDate").innerHTML = "<input id=\"arf-closedDate\" type=\"date\" />";
        archive.querySelector("#arf-closedDate").valueAsDate = doc.data().closeDate.toDate();
        archive.querySelector("#ar-ticket").innerHTML = "<input id=\"arf-ticket\" type=\"text\" value=\"".concat(doc.data().ticket, "\" />");
        archive.querySelector("#ar-currency").innerHTML = "\n        <select id=\"arf-currency\" required>\n            <option value=\"EURUSD\"".concat(archive.querySelector("#ar-currency").innerHTML == "EUR/USD" ? " selected" : "", ">EUR/USD</option>\n            <option value=\"GBPUSD\"").concat(archive.querySelector("#ar-currency").innerHTML == "GBP/USD" ? " selected" : "", ">GBP/USD</option>\n            <option value=\"AUDUSD\"").concat(archive.querySelector("#ar-currency").innerHTML == "AUD/USD" ? " selected" : "", ">AUD/USD</option>\n            <option value=\"NZDUSD\"").concat(archive.querySelector("#ar-currency").innerHTML == "NZD/USD" ? " selected" : "", ">NZD/USD</option>\n            <option value=\"XAUUSD\"").concat(archive.querySelector("#ar-currency").innerHTML == "XAU/USD" ? " selected" : "", ">XAU/USD</option>\n            <option value=\"XAGUSD\"").concat(archive.querySelector("#ar-currency").innerHTML == "XAG/USD" ? " selected" : "", ">XAG/USD</option>\n        </select>");
        archive.querySelector("#ar-leverage").innerHTML = "<input id=\"arf-leverage\" type=\"number\" value=\"".concat(doc.data().leverage, "\" />");
        archive.querySelector("#ar-bs").innerHTML = "<input id=\"arf-bs\" type=\"text\" value=\"".concat(doc.data().bsprice, "\" />");
        archive.querySelector("#ar-pl").innerHTML = "\n        <select id=\"arf-pl\">\n            <option value=\"BUY\"".concat(doc.data().bs ? " selected" : "", ">BUY</option>\n            <option value=\"SELL\"").concat(doc.data().bs ? "" : " selected", ">SELL</option>\n        </select>");
        archive.querySelector("#ar-commission").innerHTML = "<input id=\"arf-commission\" type=\"text\" value=\"".concat(doc.data().commission, "\" />");
        archive.querySelector("#ar-closePrice").innerHTML = "<input id=\"arf-closePrice\" type=\"text\" value=\"".concat(doc.data().closePrice, "\" />");
        archive.querySelector("#ar-options").innerHTML = "<a href=\"#/\" onclick=\"saveArchive('".concat(id, "')\">Save</a>/<a href=\"#/\" onclick=\"setupArchives()\">Cancel</a>")
    })["catch"](function(err) {
        updating = false;
        alert("Something went wrong: 0");
        console.error(err)
    })
}
function deleteArchive(id) {
    userRef.collection("archives").doc(id).get().then(function(archive) {
        userRef.get().then(function(doc) {
            var oldPip = archive.data().bs ? archive.data().closePrice - archive.data().bsprice : archive.data().bsprice - archive.data().closePrice;
            var newBalance = doc.data().balance - (archive.data().leverage * oldPip > 0 ? archive.data().leverage * oldPip * (1 - archive.data().commission / 100) : archive.data().leverage * oldPip);
            userRef.update({
                balance: newBalance
            }).then(function() {
                userRef.collection("archives").doc(id)["delete"]().then(function() {
                    setupArchives()
                })["catch"](function(err) {
                    alert("Something went wrong: 3");
                    console.error(err)
                })
            })["catch"](function(err) {
                alert("Something went wrong: 0x1");
                console.error(err)
            })
        })["catch"](function(err) {
            alert("Something went wrong: 0x0");
            console.error(err)
        })
    })["catch"](function(err) {
        alert("Something went wrong: 0");
        console.error(err)
    })
}
function saveArchive(id) {
    var transaction = document.getElementById("ar-".concat(id));
    var date = transaction.querySelector("#arf-date").valueAsDate;
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    var closedDate = transaction.querySelector("#arf-date").valueAsDate;
    closedDate.setMinutes(closedDate.getMinutes() + closedDate.getTimezoneOffset());
    userRef.collection("archives").doc(id).get().then(function(archive) {
        userRef.collection("archives").doc(id).update({
            "openDate": firebase.firestore.Timestamp.fromDate(date),
            "closeDate": firebase.firestore.Timestamp.fromDate(closedDate),
            "ticket": transaction.querySelector("#arf-ticket").value,
            "currency": transaction.querySelector("#arf-currency").options[transaction.querySelector("#arf-currency").selectedIndex].value,
            "leverage": parseInt(transaction.querySelector("#arf-leverage").value),
            "bsprice": parseFloat(transaction.querySelector("#arf-bs").value),
            "bs": transaction.querySelector("#arf-pl").selectedIndex == 0,
            "commission": parseFloat(transaction.querySelector("#arf-commission").value),
            "closePrice": parseFloat(transaction.querySelector("#arf-closePrice").value)
        }).then(function() {
            userRef.get().then(function(doc) {
                var oldPip = archive.data().bs ? archive.data().closePrice - archive.data().bsprice : archive.data().bsprice - archive.data().closePrice;
                var pip = transaction.querySelector("#arf-pl").selectedIndex == 0 ? parseFloat(transaction.querySelector("#arf-closePrice").value) - parseFloat(transaction.querySelector("#arf-bs").value) : parseFloat(transaction.querySelector("#arf-bs").value) - parseFloat(transaction.querySelector("#arf-closePrice").value);
                var newBalance = doc.data().balance - (archive.data().leverage * oldPip > 0 ? archive.data().leverage * oldPip * (1 - archive.data().commission / 100) : archive.data().leverage * oldPip);
                console.log(newBalance);
                if (parseInt(transaction.querySelector("#arf-leverage").value) * pip > 0)
                    newBalance += parseInt(transaction.querySelector("#arf-leverage").value) * pip * (1 - parseFloat(transaction.querySelector("#arf-commission").value) / 100);
                else
                    newBalance += parseInt(transaction.querySelector("#arf-leverage").value) * pip;
                console.log(newBalance);
                if (!isNaN(newBalance)) {
                    userRef.update({
                        "balance": newBalance
                    }).then(function() {
                        setupArchives()
                    })["catch"](function(err) {
                        alert("Something went wrong: 4");
                        console.error(err)
                    })
                } else {
                    alert("Something went wrong: 3\nPip: ".concat(pip, ", Old Pip: ").concat(oldPip, ", newBalance: ").concat(newBalance, "\n\n                    ").concat(archive.data().leverage, ", ").concat(archive.data().commission, ", ").concat(transaction.querySelector("#arf-leverage").value))
                }
            })["catch"](function(err) {
                alert("Something went wrong: 2");
                console.error(err)
            })
        })["catch"](function(err) {
            alert("Something went wrong: 0x0");
            console.error(err)
        })
    })["catch"](function(err) {
        alert("Something went wrong: 0");
        console.error(err)
    })
}
function deleteTransaction(id) {
    var transactionRef = userRef.collection("transactions").doc(id);
    transactionRef["delete"]().then(function() {
        setupTables()
    })["catch"](function(err) {
        alert("Something went wrong: 0")
    })
}
function setupArchives() {
    var table = document.getElementById("closed-body");
    var userRef = db.collection("users").doc(uid);
    var archiveRef = userRef.collection("archives");
    archiveRef.get().then(function(querySnapshot) {
        // Clear the tables.
        table.innerHTML = "";
        querySnapshot.forEach(function(doc) {
            document.getElementById("closed-transactions").style.display = "inherit";
            var pip = doc.data().bs ? doc.data().closePrice - doc.data().bsprice : doc.data().bsprice - doc.data().closePrice;
            var metal = doc.data().currency == "XAUUSD" || doc.data().currency == "XAGUSD";
            table.innerHTML += "\n                <tr id=\"ar-".concat(doc.id, "\">\n                    <td class=\"pure-form\" id=\"ar-date\">").concat(formatDate(doc.data().openDate.toDate()), "</td>\n                    <td class=\"pure-form\" id=\"ar-closedDate\">").concat(formatDate(doc.data().closeDate.toDate()), "</td>\n                    <td class=\"pure-form\" id=\"ar-ticket\">").concat(doc.data().ticket, "</td>\n                    <td class=\"pure-form\" id=\"ar-currency\">").concat(doc.data().currency.slice(0, 3), "/").concat(doc.data().currency.slice(3), "</td>\n                    <td class=\"pure-form\" id=\"ar-leverage\">").concat(formatNum(doc.data().leverage, metal)).concat(metal ? " oz" : "", "</td>\n                    <td class=\"pure-form\" id=\"ar-bs\"><strong>").concat(doc.data().bs ? "B" : "S", "</strong> ").concat(doc.data().bsprice, "</td>\n                    <td class=\"pure-form\" id=\"ar-pl\" class=\"").concat(doc.data().leverage * pip < 0 ? "neg" : "pos", "\">").concat(doc.data().leverage * pip < 0 ? "" : "+").concat(formatNum(doc.data().leverage * pip), "</td>\n                    <td class=\"pure-form\" id=\"ar-commission\">").concat(doc.data().leverage * pip > 0 ? formatNum(doc.data().leverage * pip * (doc.data().commission / 100)) : formatNum(0), "</td>\n                    <td class=\"pure-form\" id=\"ar-closePrice\"><strong>").concat(doc.data().bs ? "S" : "B", "</strong> ").concat(doc.data().closePrice, "</td>\n                    <td class=\"pure-form\" id=\"ar-options\"><a href=\"#/\" onclick=\"editArchive('").concat(doc.id, "')\">Edit</a>/<a href=\"#/\" onclick=\"deleteArchive('").concat(doc.id, "')\">Delete</a></td>\n                </tr>")
        })
    })["catch"](function(error) {
        console.log("Error getting documents: ", error)
    })
}
function archivePrompt(id) {
    var commission = prompt("Commission (in percentage)");
    if (commission != null)
        archive(id, commission == "" ? 0 : parseFloat(commission))
}
function archive(id, commission) {
    var transactionRef = userRef.collection("transactions").doc(id);
    var archivesRef = userRef.collection("archives");
    document.getElementById("opened-tables").style.display = "none";
    transactionRef.get().then(function(doc) {
        var closePrice = rates[doc.data().currency];
        archivesRef.add({
            "bs": doc.data().bs,
            "bsprice": doc.data().bsprice,
            "openDate": doc.data().openDate,
            "closeDate": firebase.firestore.FieldValue.serverTimestamp(),
            "currency": doc.data().currency,
            "leverage": doc.data().leverage,
            "ticket": doc.data().ticket,
            "commission": commission,
            "closePrice": closePrice
        }).then(function() {
            transactionRef["delete"]().then(function() {
                userRef.get().then(function(user) {
                    var pip = doc.data().bs ? closePrice - doc.data().bsprice : doc.data().bsprice - closePrice;
                    if (doc.data().leverage * pip < 0)
                        commission = 0;
                    userRef.update({
                        "balance": user.data().balance + doc.data().leverage * pip * (1 - commission / 100)
                    }).then(function() {
                        setupTables();
                        setupDeposits();
                        setupArchives()
                    })
                })
            })
        })
    })
}
function refreshUser() {
    userRef.onSnapshot(function(doc) {
        document.getElementById("account-info").style.display = "inherit";
        document.getElementById("balance").innerHTML = "".concat(formatNum(doc.data().balance))
    })
}
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        db.collection("users").doc(user.uid).get().then(function(doc) {
            if (!doc.data().admin) {
                window.location.href = "/";
                return
            }
            setupFields();
            setupTables();
            setupDeposits();
            setupArchives();
            if (uid != "new")
                refreshUser()
        })
    } else {
        window.location.href = "/"
    }
});
var formatter = new Intl.NumberFormat("en-US",{
    style: "currency",
    currency: "USD"
});
var numform = new Intl.NumberFormat("en-US",{
    style: "decimal",
    maximumFractionDigits: 0
});
function formatNum(dig) {
    var metal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!metal)
        return formatter.format(dig);
    else
        return numform.format(dig)
}
function formatDate(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return "".concat(monthNames[monthIndex], " ").concat(day, ", ").concat(year)
}
