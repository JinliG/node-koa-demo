import { ObjectId } from "mongodb";
import MongoPool from "../../db";

interface TransactionDOTypes {
  _id: any,
  prd_code: string,
  transaction_date: any,
  transaction_type: string,
  transaction_price: number,
  transaction_num: number,
  invest_type: string,
  [key: string]: any
}

interface QueryParamTypes {
  pageNo: number,
  pageSize: number,
  _id?: any,
  prd_code?: string,
  transaction_date: any,
  transaction_type: string,
  transaction_price: number,
  transaction_num: number,
  invest_type: string,
  [key: string]: any
}

interface TransactionDaoTypes {
  listAll: () => Promise<TransactionDOTypes | any>,
  findBy: (params: QueryParamTypes) => Promise<TransactionDOTypes | any>,
  add: (params: TransactionDOTypes) => Promise<any>,
  update: (id: any, params: TransactionDOTypes) => Promise<any>,
  remove: (id: any) => Promise<any>,
  [key: string]: any,
}

async function createTransactionDao(): Promise<TransactionDaoTypes> {
  const client = await MongoPool.getInstance();
  const db = client?.db('demo_stock');
  const connection = db?.collection('stock_transaction');

  return {
    listAll: async function() {
      try {
        return await connection?.find({}).toArray();
      } catch (error) {
        console.error(error);
      }
    },
    findBy: async function(queryParams: QueryParamTypes) {
      const { pageNo, pageSize, ...rest } = queryParams;
      const skipNumber = pageNo * pageSize;
      try {
        return {
          data: await connection?.find({ ...rest }).skip(skipNumber).limit(pageSize).toArray(),
          total: await connection.count(),
          pageNo
        }
      } catch (error) {
        console.error(error);
      }
    },
    add: async function(data: TransactionDOTypes) {
      try {
        await connection.insertOne(data);
        return true;
      } catch (error) {
        console.error(error);
      }
    },
    update: async function(id: any, data: TransactionDOTypes) {
      try {
        await connection.replaceOne({ _id: new ObjectId(id) }, data);
        return true;
      } catch (error) {
        console.error(error);
      }
    },
    remove: async function(id: any) {
      try {
        await connection.deleteOne({ _id: id });
        return true;
      } catch (error) {
        console.error(error);
      }
    }
  }
}

function TransactionDao() {}
TransactionDao.getInstance = (function() {
  let TransactionDao: TransactionDaoTypes;
  return async function() {
    if (!TransactionDao) {
      TransactionDao = await createTransactionDao();
    }

    return TransactionDao;
  }
})();

export default TransactionDao;