/** Electron around positive enclosed flux; circular gauge for the partial-path readout. */
export function magneticLoop(angleDegrees: number) {
  const fluxFraction = .25;
  const fluxWebers = fluxFraction * 6.62607015e-34 / 1.602176634e-19;
  const phaseDegrees = angleDegrees === 0 ? 0 : -fluxFraction * angleDegrees;
  return {fluxFraction, fluxWebers, phaseDegrees, phaseRadians:phaseDegrees*Math.PI/180};
}
