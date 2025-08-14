class Customer {
    constructor(name, email, address) {
        this.name = name;
        this.email = email;
        this.address = address;
        this.id = Customer.nextId++;
    }
    getDetail() {
        console.log(`id:${this.id}, name: ${this.name}, email: ${this.email}, address: ${this.address}`);
    }
}
Customer.nextId = 1;
class Product {
    constructor(name, price, stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.id = Product.nextId++;
    }
    sell(quantity) {
        if (this.stock >= quantity) {
            this.stock -= quantity;
        }
        else {
            console.log(`khong du hang trong kho`);
        }
    }
    restock(quantity) {
        this.stock += quantity;
    }
}
Product.nextId = 1;
class ElectronicsProduct extends Product {
    constructor(name, price, stock, warrantyPeriod) {
        super(name, price, stock);
        this.warrantyPeriod = warrantyPeriod;
    }
    getProductInfo() {
        return `id:${this.id} ,electronic: ${this.name}, price: ${this.price}, stock: ${this.stock}, warrantyPeriod: ${this.warrantyPeriod} month`;
    }
    getShippingCost(distance) {
        return 50000;
    }
    getCategory() {
        return `electronic`;
    }
}
class ClothingProduct extends Product {
    constructor(name, price, stock, size, color) {
        super(name, price, stock);
        this.size = size;
        this.color = color;
    }
    getProductInfo() {
        return `id: ${this.id}, clothing: ${this.name}, stock: ${this.stock}, size: ${this.size}, color: ${this.color}`;
    }
    getShippingCost(distance) {
        return 25000;
    }
    getCategory() {
        return `clothing`;
    }
}
class Order {
    constructor(customer, products, totalAmount) {
        this.customer = customer;
        this.products = products;
        this.totalAmount = totalAmount;
        this.orderId = Order.nextId++;
    }
    getDetail() {
        console.log(`Don hang id ${this.orderId}`);
        console.log(`Khach hang: ${this.customer.name}`);
        this.products.forEach(e => {
            console.log(`-${e.product.name} x ${e.quantity} = ${e.product.price * e.quantity}`);
        });
        console.log(`Tong don hang: ${this.totalAmount}`);
    }
}
Order.nextId = 1;
class Store {
    constructor(products = [], customers = [], orders = []) {
        this.products = products;
        this.customers = customers;
        this.orders = orders;
    }
    addProduct(type, name, price, stock, extra) {
        let product;
        if (type === "Electronics") {
            product = new ElectronicsProduct(name, price, stock, extra.warrantyPeriod);
        }
        else {
            product = new ClothingProduct(name, price, stock, extra.size, extra.color);
        }
        this.products.push(product);
        console.log(`Đã thêm sản phẩm: ${product.getProductInfo()}`);
    }
    listProducts() {
        if (this.products.length === 0) {
            console.log("Chưa có sản phẩm nào trong cửa hàng.");
            return;
        }
        console.log("Danh sách sản phẩm trong cửa hàng");
        this.products.forEach(p => console.log(p.getProductInfo()));
    }
    addCustome(name, email, address) {
        const customer = new Customer(name, email, address);
        this.customers.push(customer);
        console.log(`da them khach hang`);
    }
    listCustome() {
        if (this.addCustome.length === 0) {
            console.log(`khong ton ta khach hang nao`);
        }
        else {
            console.log(`danh sach khach hang`);
            this.customers.forEach(c => {
                console.log(c.getDetail());
            });
        }
    }
    createOrder(custumerId, productQuantities) {
        const custumer = this.customers.find(e => e.id === custumerId);
        if (!custumer) {
            console.log(`khong tim thay khach hang`);
            return null;
        }
        let orderProducts = [];
        let totalAmount = 0;
        for (const pq of productQuantities) {
            const product = this.products.find(p => p.id === pq.productId);
            if (!product) {
                console.log(`khong tim thay san pham co id: ${pq.productId}`);
                return null;
            }
            if (product.stock < pq.quantity) {
                console.log(`khong du hang cho san pham`);
                return null;
            }
            product.sell(pq.quantity);
            orderProducts.push({ product, quantity: pq.quantity });
            totalAmount += pq.quantity * product.price;
        }
        const order = new Order(custumer, orderProducts, totalAmount);
        this.orders.push(order);
        console.log(`tao don hang thanh cong`);
        order.getDetail();
        return order;
    }
    cancelOrder(orderId) {
        const orderIndex = this.orders.findIndex(o => o.orderId === orderId);
        if (!orderIndex) {
            console.log(`khong tim thay don hang`);
            return null;
        }
        const order = this.orders[orderIndex];
        order.products.forEach(e => {
            e.product.restock(e.quantity);
        });
        this.orders.splice(orderIndex, 1);
        console.log(`don hang co id: ${orderId} da bi huy va chuyen ve kho`);
    }
    listAvailable() {
        const product = this.products.filter(p => p.stock > 0);
        if (!product) {
            console.log(`khong co san pham nao con hang`);
            return null;
        }
        console.log(`Nhung don hang con trong kho:`);
        product.forEach(p => {
            console.log(`id: ${p.id}, name: ${p.name}, price: ${p.price}, stock: ${p.stock}`);
        });
    }
    listCustomerOrder(customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) {
            console.log(`khong tim thay khach hang`);
            return null;
        }
        const custumerOrder = this.orders.filter(c => c.customer.id === customerId);
        console.log(`Danh sach don hang cua khach hang ${customer.name}`);
        custumerOrder.forEach(order => order.getDetail());
    }
    calculateTotalRevenue() {
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        console.log(`tong doanh thu cua cua hang la: ${totalRevenue}`);
    }
    // countProductByCategory():void{}
    updateProductStock(productId, newStock) {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (!productIndex) {
            console.log(`khong tim thay san pham`);
            return null;
        }
        this.products[productIndex].stock = newStock;
        console.log(`Da cap nhat ton kho cua san pham ${this.products[productIndex].name} = ${newStock}`);
    }
}
const store = new Store();
//  1.Them khach hang moi
store.addCustome("tien", "tienxinhzai241@gmail.com", "khoi 8 thi tran binh minh huyen kim son");
store.listCustome();
//  2.Them san pham moi
store.addProduct("Electronics", "lenovo legion5", 190000000, 5, { warrantyPeriod: 3 });
store.addProduct("Clothing", "ao ba lo", 12000, 7, { size: "Xl", color: "xanh" });
store.listProducts();
//  3.Tao don hang moi
store.createOrder(1, [
    { productId: 1, quantity: 3 },
    { productId: 2, quantity: 4 }
]);
//  4.Huy don hang
store.cancelOrder(1);
//  5.Hien thi danh sach san pham con hang trong kho
store.listAvailable();
//  6.hien thi danh sach don hang cua mot khach hang
store.listCustomerOrder(1);
//  7.tinh va hien thi tong doanh thu cua cua hang
store.calculateTotalRevenue();
//  8.thong ke san pham theo danh muc
//  9.cap nhat ton kho cho mot san pham
store.updateProductStock(2, 100);
store.products.forEach(e => console.log(e.getProductInfo()));
//  10.tim kiem va hien thi thong tin bang id
//  11.xem thong tin chi tiet
