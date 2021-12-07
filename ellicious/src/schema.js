//모든 resolover 와 tyoedefs 를 합쳐줌
import {makeExecutableSchema} from 'graphql-tools';
import {fileLoader, mergeResolvers, mergeTypes} from 'merge-graphql-schemas';

import path from 'path';

const allTypes = fileLoader(path.join(__dirname, "/api/**/*.graphql")); //**는 모든 폴더 *.graphql은 모든 graphql파일을 지칭.
const allResolvers = fileLoader(path.join(__dirname, "/api/**/*.js"));  //모든 resolver들고오기.  !! api밑에 리솔버 아닌 js파일 나두지마라!

const schema = makeExecutableSchema({
    typeDefs: mergeTypes(allTypes),
    resolvers: mergeResolvers(allResolvers)
});

export default schema;