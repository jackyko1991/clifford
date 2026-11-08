import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("interactive learning tools obey quarter turns and Hamilton’s multiplication rules",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const {quaternionProduct,quarterTurn}=await server.ssrLoadModule("/src/learningModel.ts");
  assert.deepEqual([0,1,2,3,4].map(n=>quarterTurn(n).tex),["1","i","-1","-i","1"]);
  assert.deepEqual(quarterTurn(2),{x:-1,y:0,tex:"-1"});
  for(const q of ["i","j","k"])assert.equal(quaternionProduct(q,q),"-1");
  for(const [a,b,c] of [["i","j","k"],["j","k","i"],["k","i","j"]]){
   assert.equal(quaternionProduct(a,b),c);assert.equal(quaternionProduct(b,a),"-"+c);
  }
 }finally{await server.close();}
});
