# MongoDB 测试数据存储指南

## 概述

MongoDB 作为文档数据库，灵活的数据模型使其成为存储测试数据（fixtures）的理想选择。本指南介绍多种创建和管理测试数据的方法。

## 目录

- [基础插入](#基础插入)
- [Factory 模式](#factory-模式)
- [数据播种工具](#数据播种工具)
- [Jest 集成](#jest-集成)
- [最佳实践](#最佳实践)

---

## 基础插入

### 单条插入

```javascript
// 使用 MongoDB Native Driver
const { MongoClient } = require('mongodb');

async function insertOneUser() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test');
  
  const user = {
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    tags: ['测试', '开发'],
    createdAt: new Date()
  };
  
  const result = await db.collection('users').insertOne(user);
  console.log('插入的文档 ID:', result.insertedId);
  
  await client.close();
}
```

### 批量插入

```javascript
async function insertManyUsers() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test');
  
  const users = [
    { name: '用户1', email: 'user1@example.com', age: 20 },
    { name: '用户2', email: 'user2@example.com', age: 21 },
    { name: '用户3', email: 'user3@example.com', age: 22 }
  ];
  
  const result = await db.collection('users').insertMany(users);
  console.log('插入数量:', result.insertedCount);
  
  await client.close();
}
```

### 插入后查询

```javascript
async function insertAndFind() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test');
  
  // 插入
  const { insertedId } = await db.collection('posts').insertOne({
    title: '测试文章',
    content: '这是测试内容',
    author: '作者',
    views: 0,
    published: true
  });
  
  // 立即查询
  const doc = await db.collection('posts').findOne({ _id: insertedId });
  console.log('插入的文档:', doc);
  
  await client.close();
}
```

---

## Factory 模式

Factory 模式用于生成结构化的测试数据，避免手动创建每个文档。

### 基础 Factory

```javascript
// factories/userFactory.js
class UserFactory {
  static create(data = {}) {
    return {
      name: data.name || this.randomName(),
      email: data.email || this.randomEmail(),
      age: data.age || this.randomAge(),
      avatar: data.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
      bio: data.bio || this.randomBio(),
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      ...data
    };
  }
  
  static randomName() {
    const names = ['张三', '李四', '王五', '赵六', '钱七'];
    return names[Math.floor(Math.random() * names.length)];
  }
  
  static randomEmail() {
    return `user${Date.now()}@example.com`;
  }
  
  static randomAge() {
    return Math.floor(Math.random() * 50) + 18; // 18-67岁
  }
  
  static randomBio() {
    const bios = [
      '热爱编程',
      '喜欢音乐',
      '运动爱好者',
      '阅读爱好者'
    ];
    return bios[Math.floor(Math.random() * bios.length)];
  }
  
  // 生成多个用户
  static createMany(count, baseData = {}) {
    return Array.from({ length: count }, () => this.create(baseData));
  }
}

module.exports = UserFactory;
```

### 使用 Factory 生成数据

```javascript
const UserFactory = require('./factories/userFactory');

async function generateTestData() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('test');
  
  // 生成 10 个用户
  const users = UserFactory.createMany(10, { age: 25 });
  
  await db.collection('users').insertMany(users);
  console.log(`已插入 ${users.length} 个用户`);
  
  await client.close();
}
```

### 带关联的 Factory

```javascript
// factories/orderFactory.js
const UserFactory = require('./userFactory');

class OrderFactory {
  static create(data = {}) {
    const now = new Date();
    return {
      orderNo: data.orderNo || `ORD${Date.now()}${Math.random().toString(36).substr(2, 6)}`,
      userId: data.userId, // 外部传入或关联
      items: data.items || this.randomItems(),
      totalAmount: data.totalAmount || this.calcTotal(data.items),
      status: data.status || 'pending',
      createdAt: data.createdAt || now,
      shippedAt: data.shippedAt || null,
      completedAt: data.completedAt || null,
      ...data
    };
  }
  
  static randomItems() {
    const items = [];
    const count = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < count; i++) {
      items.push({
        productId: `PROD${Math.random().toString(36).substr(2, 8)}`,
        name: `商品${i + 1}`,
        price: Math.floor(Math.random() * 100) + 10,
        quantity: Math.floor(Math.random() * 5) + 1
      });
    }
    return items;
  }
  
  static calcTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  
  static createMany(count, baseData = {}) {
    return Array.from({ length: count }, () => this.create(baseData));
  }
}

module.exports = OrderFactory;
```

---

## 数据播种工具

### mongo-seeding

[mongo-seeding](https://github.com/CACERSMARCIN/mongo-seeding) 从 JSON/JS 文件播种数据。

#### 安装

```bash
npm install mongo-seeding
```

#### 配置

```javascript
// seed.config.js
const { Seeder } = require('mongo-seeding');

const config = {
  mongodb: {
    host: 'localhost',
    port: 27017,
    database: 'test'
  },
  dropDatabase: false
};

const seeder = new Seeder(config);
```

#### 定义数据

```json
// data/users.json
[
  {
    "_id": "user-1",
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25
  },
  {
    "_id": "user-2", 
    "name": "李四",
    "email": "lisi@example.com",
    "age": 30
  }
]
```

```javascript
// data/orders.js
module.exports = [
  {
    _id: 'order-1',
    userId: 'user-1',
    items: [
      { productId: 'PROD001', name: '商品A', price: 99.9, quantity: 2 }
    ],
    totalAmount: 199.8,
    status: 'completed'
  }
];
```

#### 执行播种

```javascript
const { Seeder } = require('mongo-seeding');
const path = require('path');

const seeder = new Seeder({
  mongodb: {
    host: 'localhost',
    port: 27017,
    database: 'test'
  }
});

const collections = seeder.readCollectionsFromPath(
  path.resolve('./data'),
  { extensions: ['js', 'json'] }
);

seeder
  .import(collections)
  .then(() => console.log('数据播种完成'))
  .catch(err => console.error('播种失败:', err));
```

### mongofill

[mongofill](https://github.com/felipecaputo/mongofill) 提供 Faker 风格的测试数据生成。

#### 安装

```bash
npm install mongofill faker
```

#### 使用示例

```javascript
const MongoFill = require('mongofill').default;
const Faker = require('faker');

const mongoFill = new MongoFill({
  seed: true, // 固定种子，可复现
  seedNumber: 12345
});

// 生成用户数据
const users = mongoFill.generate('users', {
  name: () => Faker.name.findName(),
  email: () => Faker.internet.email(),
  avatar: () => Faker.internet.avatar(),
  address: {
    city: () => Faker.address.city(),
    country: () => Faker.address.country(),
    zipCode: () => Faker.address.zipCode()
  }
}, 10); // 生成 10 条

console.log(users);
```

---

## Jest 集成

### @shelf/jest-mongodb

[@shelf/jest-mongodb](https://github.com/shelfio/jest-mongodb) 提供完整的 MongoDB 测试环境。

#### 安装

```bash
npm install --save-dev @shelf/jest-mongodb
```

#### 配置 jest.config.js

```javascript
module.exports = {
  preset: '@shelf/jest-mongodb'
};
```

#### 编写测试

```javascript
// user.test.js
const { MongoClient } = require('mongodb');

describe('用户 CRUD 测试', () => {
  let client;
  let db;
  
  // 所有测试前连接
  beforeAll(async () => {
    client = await MongoClient.connect(global.__MONGO_URI__);
    db = client.db(global.__MONGO_DB_NAME__);
  });
  
  // 每个测试前清理
  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });
  
  // 所有测试后关闭
  afterAll(async () => {
    await client.close();
  });
  
  test('创建用户', async () => {
    const user = {
      name: '测试用户',
      email: 'test@example.com',
      age: 25
    };
    
    const result = await db.collection('users').insertOne(user);
    
    expect(result.insertedId).toBeDefined();
    expect(result.acknowledged).toBe(true);
  });
  
  test('查询用户', async () => {
    // 插入测试数据
    await db.collection('users').insertOne({
      name: '张三',
      email: 'zhangsan@example.com'
    });
    
    // 查询
    const user = await db.collection('users').findOne({ name: '张三' });
    
    expect(user).toBeDefined();
    expect(user.email).toBe('zhangsan@example.com');
  });
  
  test('更新用户', async () => {
    const { insertedId } = await db.collection('users').insertOne({
      name: '李四',
      age: 20
    });
    
    await db.collection('users').updateOne(
      { _id: insertedId },
      { $set: { age: 25 } }
    );
    
    const updated = await db.collection('users').findOne({ _id: insertedId });
    expect(updated.age).toBe(25);
  });
  
  test('删除用户', async () => {
    const { insertedId } = await db.collection('users').insertOne({
      name: '王五'
    });
    
    await db.collection('users').deleteOne({ _id: insertedId });
    
    const deleted = await db.collection('users').findOne({ _id: insertedId });
    expect(deleted).toBeNull();
  });
});
```

### 使用 Factory 的完整示例

```javascript
// userWithFactory.test.js
const UserFactory = require('../factories/userFactory');

describe('UserFactory 测试', () => {
  let client;
  let db;
  
  beforeAll(async () => {
    client = await MongoClient.connect(global.__MONGO_URI__);
    db = client.db(global.__MONGO_DB_NAME__);
  });
  
  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });
  
  afterAll(async () => {
    await client.close();
  });
  
  test('批量创建用户', async () => {
    const users = UserFactory.createMany(5);
    
    const result = await db.collection('users').insertMany(users);
    
    expect(result.insertedCount).toBe(5);
  });
  
  test('创建带关联的订单', async () => {
    // 创建用户
    const user = UserFactory.create({ name: '订单测试用户' });
    const { insertedId: userId } = await db.collection('users').insertOne(user);
    
    // 创建订单
    const OrderFactory = require('../factories/orderFactory');
    const order = OrderFactory.create({ userId });
    
    await db.collection('orders').insertOne(order);
    
    // 验证关联
    const savedOrder = await db.collection('orders').findOne({ _id: order._id });
    expect(savedOrder.userId.toString()).toBe(userId.toString());
  });
});
```

---

## 性能优化

### 批量操作

```javascript
// 坏的写法 - 逐条插入
for (const user of users) {
  await db.collection('users').insertOne(user);
}

// 好的写法 - 批量插入
await db.collection('users').insertMany(users);

// 更好的写法 - 分批批量插入
async function bulkInsert(collection, documents, batchSize = 1000) {
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    await collection.insertMany(batch, { ordered: false });
  }
}
```

### 索引优化

```javascript
// 测试前创建索引
await db.collection('users').createIndex({ email: 1 }, { unique: true });
await db.collection('orders').createIndex({ userId: 1, createdAt: -1 });

// 测试后删除索引
await db.collection('users').dropIndex('email_1');
```

### 假删除模式

```javascript
// 使用 deletedAt 字段代替物理删除
await db.collection('users').updateOne(
  { _id: userId },
  { $set: { deletedAt: new Date() } }
);

// 查询时排除已删除
const activeUsers = await db.collection('users').find({
  deletedAt: { $exists: false }
});
```

---

## 最佳实践

### 1. 数据隔离

```javascript
// 每个测试使用唯一数据库
beforeAll(async () => {
  const { MongoClient } = require('mongodb');
  const crypto = require('crypto');
  
  const uniqueDbName = `test_${crypto.randomBytes(8).toString('hex')}`;
  client = await MongoClient.connect('mongodb://localhost:27017');
  db = client.db(uniqueDbName);
});

afterAll(async () => {
  await db.dropDatabase();
  await client.close();
});
```

### 2. 可复现数据

```javascript
// 使用固定种子
function createSeededFaker(seed) {
  const Faker = require('faker');
  Faker.seed(seed);
  return Faker;
}

// 每次测试使用相同数据
const faker = createSeededFaker(12345);
const user = { name: faker.name.findName() };
```

### 3. 数据清理

```javascript
// 使用 afterEach 清理每个测试的数据
afterEach(async () => {
  const collections = await db.listCollections().toArray();
  for (const coll of collections) {
    await db.collection(coll.name).deleteMany({});
  }
});
```

### 4. 异步工厂

```javascript
// 对于需要数据库操作的工厂
class AsyncUserFactory {
  static async create(db, data = {}) {
    const user = UserFactory.create(data);
    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }
  
  static async createMany(db, count, baseData = {}) {
    const users = UserFactory.createMany(count, baseData);
    const result = await db.collection('users').insertMany(users);
    return users.map((u, i) => ({ ...u, _id: result.insertedIds[i] }));
  }
}
```

---

## 相关资源

- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [@shelf/jest-mongodb](https://github.com/shelfio/jest-mongodb)
- [mongo-seeding](https://github.com/CACERSMARCIN/mongo-seeding)
- [mongofill](https://github.com/felipecaputo/mongofill)
- [Faker.js](https://fakerjs.dev/)
