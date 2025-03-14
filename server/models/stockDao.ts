import MongoPool from "../../db";

interface StockDOTypes {
  _id: any,
  prd_code: string,
  buy_in: number,
  sell_out: number,
  buy_price: number,
  sell_price: number,
  [key: string]: any
}

interface QueryParamTypes {
  pageNo: number,
  pageSize: number,
  _id?: any,
  prd_code?: string,
  buy_in: number,
  sell_out: number,
  buy_price: number,
  sell_price: number,
  [key: string]: any
}

interface StockDaoTypes {
  listAll: () => Promise<StockDOTypes | any>,
  findBy: (params: QueryParamTypes) => Promise<StockDOTypes | any>,
  [key: string]: any,
}

async function createStockDao(): Promise<StockDaoTypes> {
  const client = await MongoPool.getInstance();
  const db = client?.db('demo_stock');
  const connection = db?.collection('stock_production');

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
        const result = {
          data: await connection?.find({ ...rest }).skip(skipNumber).limit(pageSize).toArray(),
          total: await connection.count(),
          pageNo,
        }
        return result;
      } catch (error) {
        console.error(error);
      }
    },
  }
}

function StockDao() {}
StockDao.getInstance = (function() {
  let StockDao: StockDaoTypes;
  return async function() {
    if (!StockDao) {
      StockDao = await createStockDao();
    }

    return StockDao;
  }
})();

export default StockDao;