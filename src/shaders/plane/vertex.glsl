#define PHONG

uniform float uTime;

varying vec3 vViewPosition;
varying vec2 vUv;


#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>


float getZ(float x, float y)
{
	//return sin((x) * 55.0 + 5.0 * uTime) * cos((2.0 * y + 0.5) * 20.0 + 3.0 * uTime) * 0.05;

	return sin((x + y) * 55.0 + 5.0 * uTime) * 0.05;
}

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	//#include <beginnormal_vertex>

	float cellSize = 4.0 / 1000.0;

	float z = getZ(uv.x, uv.y); // sin(uv.x * 80.0 + 5.0 * uTime) * sin(uv.y * 20.0 + uTime) * 0.07;
	float z_north = getZ(uv.x, uv.y + cellSize); //sin((uv.x) * 80.0 + 5.0 * uTime) * sin((uv.y + cellSize) * 20.0 + uTime) * 0.07;
	float z_south = getZ(uv.x, uv.y - cellSize); //sin((uv.x) * 80.0 + 5.0 * uTime) * sin((uv.y - cellSize) * 20.0 + uTime) * 0.07;
	float z_east = getZ(uv.x - cellSize, uv.y); //sin((uv.x - cellSize) * 80.0 + 5.0 * uTime) * sin((uv.y) * 20.0 + uTime) * 0.07;
	float z_west = getZ(uv.x + cellSize, uv.y); //sin((uv.x + cellSize) * 80.0 + 5.0 * uTime) * sin((uv.y) * 20.0 + uTime) * 0.07;

	vec3 objectNormal = vec3(
								(z_east - z_west),
								(z_south - z_north), 
								1.0);

	

	// vec3 objectNormal = vec3( normal );

	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
 
	vNormal = normalize( transformedNormal );

#endif

	#include <begin_vertex>
	transformed.z -= z;

	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>	
	#include <project_vertex>	
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

	vUv = uv;
}
