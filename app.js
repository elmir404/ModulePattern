//Stroge controller
const Strogecontroller = (function () {

})();


//Product controller
const Productcontroller = (function () {
    //PRIVATE
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    const data = {
        products: [],
        selectedProduct: null,
        totalPrice: 0
    }
    //public
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        getProductById: function (id) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;

        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }
            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;

        },
        updateProduct: function (name,price) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id = data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });
            return product;
        },
        getTotal: function () {
            let total = 0;
            data.products.forEach(function (item) {
                total += item.price;
            })
            data.totalPrice = total;
            return data.totalPrice;
        },

    }

})();

//UI controller
const UIcontroller = (function () {
    const Selectors = {
        productList: '#item-list',
        productListItems: "#item-list tr",
        addButton: '.addBtn',
        ProductName: '#Productname',
        ProductPrice: '#Productprice',
        productCard: '#productCard',
        totalTl: '#total-tl',
        totalDolar: '#total-dolar',
        updateBtn: '.updateBtn',
        cancelBtn: '.cancelBtn',
        deleteBtn: '.deleteBtn'


    }
    return {
        CreateProductList: function (products) {
            let html = "";
            products.forEach(prd => {
                html +=
                    `<tr>
                      <td>${prd.id}</td>
                  <td>${prd.name}</td>
                   <td>${prd.price}</td>
                   <td class="text-right">  
                   <i class="far fa-edit edit-product"></i>
                    
                   </td>
                  </tr>`;
            });
            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function (prd) {
            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = ` <tr>
            <td>${prd.id}</td>
             <td>${prd.name}</td>
             <td>${prd.price}</td>
               <td class="text-right"> 
               <i class="far fa-edit edit-product"></i> </td>
                 </tr>`;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function (prd) {
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            });
            return updatedItem;
        },

        clearInputs: function () {
            document.querySelector(Selectors.ProductName).value = '';
            document.querySelector(Selectors.ProductPrice).value = '';
        },
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTl).textContent = total * 4.5;
        },
        addProductToForm: function () {
            const selectedProduct = Productcontroller.getCurrentProduct();
            document.querySelector(Selectors.ProductName).value = selectedProduct.name;
            document.querySelector(Selectors.ProductPrice).value = selectedProduct.price;
        },
        addingState: function () {
            UIcontroller.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateBtn).style.display = 'none';
            document.querySelector(Selectors.deleteBtn).style.display = 'none';
            document.querySelector(Selectors.cancelBtn).style.display = 'none';
        },
        editState: function (tr) {
            const parent = tr.parentNode;
            for (let i = 0; i < parent.children.length; i++) {
                parent.children[i].classList.remove('bg-warning');
            }
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateBtn).style.display = 'inline';
            document.querySelector(Selectors.deleteBtn).style.display = 'inline';
            document.querySelector(Selectors.cancelBtn).style.display = 'inline';
        }

    }

})();


//App controller
const App = (function (ProductCtrl, UICtrl) {
    //PRIVATE
    const UIselectros = UIcontroller.getSelectors();
    //load event liseners
    const LoadEventListeners = function () {
        //add product item
        document.querySelector(UIselectros.addButton).addEventListener('click', function (e) {
            const Productname = document.querySelector(UIselectros.ProductName).value;
            const Productprice = document.querySelector(UIselectros.ProductPrice).value;
            if (Productname !== '' && Productprice !== '') {
                const newProduct = ProductCtrl.addProduct(Productname, Productprice)
                UIcontroller.addProduct(newProduct);
                //clear inputs
                UIcontroller.clearInputs();
                //get total
                const total = ProductCtrl.getTotal();
                //show total
                UICtrl.showTotal(total);

            }

            e.preventDefault();
        });
        //edit product
        document.querySelector(UIselectros.productList).addEventListener('click', function (e) {
            if (e.target.classList.contains('edit-product')) {
                const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

                //get selected product
                const product = ProductCtrl.getProductById(id);
                //set current product
                ProductCtrl.setCurrentProduct(product);
                //add product ui
                UICtrl.addProductToForm();

                UICtrl.editState(e.target.parentNode.parentNode);
            }



            e.preventDefault();
        });
        document.querySelector(UIselectros.updateBtn).addEventListener('click', function (e) {
            const Productname = document.querySelector(UIselectros.ProductName).value;
            const Productprice = document.querySelector(UIselectros.ProductPrice).value;

            if (Productname !== '' && Productprice !== '') {
                const updatedProduct = ProductCtrl.updateProduct(Productname,Productprice)
               
                let item = UIcontroller.updateProduct(updatedProduct);

                const total = ProductCtrl.getTotal();
                //show total
                UICtrl.showTotal(total);

            }
            e.preventDefault();
        })


    }



    return {
        init: function () {
            console.log('starting app...');
            UICtrl.addingState();
            const products = ProductCtrl.getProducts();
            if (products.length == 0) {
                UICtrl.hideCard();
            }
            else {

                UICtrl.CreateProductList(products);

            }
            LoadEventListeners();

        }
    }

})(Productcontroller, UIcontroller);
App.init();
