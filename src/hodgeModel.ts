export function periodicHodge(x:number,y:number,a:number,b:number,c:number){
 const gradient=[a*Math.sin(x),a*Math.sin(y)],solenoidal=[-b*Math.sin(x)*Math.cos(y),b*Math.cos(x)*Math.sin(y)],harmonic=[c,0];
 return {gradient,solenoidal,harmonic,total:gradient.map((v,i)=>v+solenoidal[i]+harmonic[i]),phi:-a*(Math.cos(x)+Math.cos(y)),psi:b*Math.sin(x)*Math.sin(y),divergence:a*(Math.cos(x)+Math.cos(y)),curl:-2*b*Math.sin(x)*Math.sin(y)};
}
export const hodgePinnCode=String.raw`import torch
from torch import nn

torch.manual_seed(0)
# Smooth pointwise MLP; this checks a local identity, not periodic BCs.
net = nn.Sequential(nn.Linear(2, 16), nn.Tanh(), nn.Linear(16, 1)).double()
xy = torch.randn(16, 2, dtype=torch.float64, requires_grad=True)
mean_flow = nn.Parameter(torch.tensor([0.2, 0.0], dtype=torch.float64))

def grad(z):
    return torch.autograd.grad(z, xy, torch.ones_like(z),
                               create_graph=True)[0]

psi = net(xy)
g = grad(psi)
u = torch.stack((-g[:, 1], g[:, 0]), dim=1) + mean_flow
# Mixed partials cancel: -psi_yx + psi_xy = 0.
div_u = grad(u[:, 0])[:, 0] + grad(u[:, 1])[:, 1]
assert div_u.abs().max() < 1e-10
# Still train momentum, boundary/initial conditions, and available data.`;
