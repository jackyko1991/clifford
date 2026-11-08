import {test} from "node:test";
import assert from "node:assert/strict";
import {magneticLoop} from "../src/magneticLoop.ts";
test("enclosed flux stays fixed while the electron accumulates winding phase",()=>{
 const start=magneticLoop(0),one=magneticLoop(360),two=magneticLoop(720);
 assert.ok(Math.abs(start.fluxWebers-1.033916924e-15)<1e-24);
 assert.equal(start.fluxWebers,one.fluxWebers);
 assert.equal(start.fluxWebers,two.fluxWebers);
 assert.equal(start.phaseDegrees,0);
 assert.equal(one.phaseDegrees,-90);
 assert.equal(one.phaseRadians,-Math.PI/2);
 assert.equal(two.phaseDegrees,-180);
 assert.equal(magneticLoop(90).phaseDegrees,-22.5);
});
