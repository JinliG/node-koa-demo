import MongoPool from "../../db";

interface UserDOTypes {
  _id: any,
  name: string,
  roleIds: string[],
  phone: string,
  email: string,
  [key: string]: any
}

interface QueryParamTypes {
  pageNo: number,
  pageSize: number,
  _id?: any,
  name?: string,
  roleIds?: string[],
  phone?: string,
  email?: string,
  [key: string]: any
}

interface UserDaoTypes {
  listAll: () => Promise<UserDOTypes | any>,
  findBy: (params: QueryParamTypes) => Promise<UserDOTypes | any>,
  [key: string]: any,
}

async function createUserDao(): Promise<UserDaoTypes> {
  const client = await MongoPool.getInstance();
  const db = client?.db('node_server_demo');
  const connection = db?.collection('user');

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
        const result = await connection?.find({ ...rest }).skip(skipNumber).limit(pageSize).toArray();
        return result;
      } catch (error) {
        console.error(error);
      }
    }
  }
}

function UserDao() {}
UserDao.getInstance = (function() {
  let userDao: UserDaoTypes;
  return async function() {
    if (!userDao) {
      userDao = await createUserDao();
    }

    return userDao;
  }
})();

export default UserDao;