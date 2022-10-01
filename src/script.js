import './style.css'

import * as THREE from 'three'

import planeVertexShader from './shaders/plane/vertex.glsl'
import planeFragmentShader from './shaders/plane/fragment.glsl'
import gsap from 'gsap'

/**
 * Constants
 */


 const PLANE_SHININESS = 40;

const planeUniforms = 
{
  uTime : {value : 0},
  diffuse : {value : new THREE.Color( 0x1220d0 )},
  specular : {value : new THREE.Color( 0x1280a3 )},
  shininess : {value :  PLANE_SHININESS},
  opacity : {value : 1.0},
  uMouseTransparencySensitivity : {value : 10}
}

const sound = new Audio('sounds/waves.mp3')
sound.volume = 0.02;
sound.loop = true;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color(0xeaeafa)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
})


/**
 * Raycaster
 */
const mouse = {
  x: 0,
  y: 0
}


window.addEventListener('mousemove', (event) => {
  const newPositionX = event.clientX / sizes.width * 2 - 1
  const newPositionY = -(event.clientY / sizes.height) * 2 + 1

  gsap.to(mouse, { x: newPositionX, duration: 1 })
  gsap.to(mouse, { y: newPositionY, duration: 1 })

})

const raycaster = new THREE.Raycaster();

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.01, 10000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 1
scene.add(camera)

/**
 * Axis Helper
 */
// const axisHelper = new THREE.AxesHelper(100);
// scene.add(axisHelper)

/**
 * Light
 */

 const directionalLight = new THREE.DirectionalLight(0xffffff, 0.55);
 directionalLight.position.set(0, 0, 1.0)
 scene.add(directionalLight);

  const lightTarget = new THREE.Object3D();
  directionalLight.target = lightTarget;
scene.add(lightTarget)


const ambientLight = new THREE.AmbientLight(0x00aa00, 0.5)
scene.add(ambientLight)

 /**
  * Plane
  */

  const planeGeometry = new THREE.PlaneGeometry(6, 6, 200, 200);
  const planeMaterial = new THREE.ShaderMaterial(
    {
      transparent: true,
      uniforms: THREE.UniformsUtils.merge( 
                                          [
                                            {
                                              'uTime': { value: null },
                                              'uMousePosition': { value: new THREE.Vector2(0.0, 0.0)},
                                              'uMouseTransparencySensitivity': { value: null},
                                            },
                                            THREE.ShaderLib[ 'phong' ].uniforms
                                          ]),
      vertexShader: planeVertexShader,
      fragmentShader: planeFragmentShader,
      
    })

 
    planeMaterial.lights = true;

   // Sets the uniforms with the material values
   planeMaterial.uniforms[ 'uTime' ] =  planeUniforms.uTime; 
   planeMaterial.uniforms[ 'diffuse' ] =  planeUniforms.diffuse; // {value : new THREE.Color( 0x1220d0 )}
   planeMaterial.uniforms[ 'specular' ] = planeUniforms.specular; // {value : new THREE.Color( 0x1280a3 )}
   planeMaterial.uniforms[ 'shininess' ] = planeUniforms.shininess; // {value :  60};
   planeMaterial.uniforms[ 'opacity' ]= planeUniforms.opacity; // {value : 1.0};
   planeMaterial.uniforms[ 'uMouseTransparencySensitivity' ]=  planeUniforms.uMouseTransparencySensitivity; //{value : DEFAULT_MOUSE_TRANSPARENCY_SENSITIVITY};
   
 
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.position.set(0, 0, -1);

  camera.add( plane );
 

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setClearAlpha(0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * 
 */
window.addEventListener('click', () => {
  var tl = gsap.timeline();
  tl.to(planeUniforms.shininess, { value: PLANE_SHININESS + 80, duration: 0.4});
  tl.to(planeUniforms.shininess, { value: PLANE_SHININESS, duration: 0.2});
  
  sound.play();
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    planeUniforms.uTime.value = elapsedTime;

    /**
     * Raycaster
     */
    raycaster.setFromCamera(mouse, camera);

    let intersect = raycaster.intersectObject(plane);
    if(intersect.length){

      lightTarget.position.set( -intersect[0].point.x, -intersect[0].point.y, intersect[0].point.z)

      planeMaterial.uniforms.uMousePosition.value = intersect[0].uv;
      
    }else{
      
    }
    
    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick();

function  createBlockElements(){

  const block1 = document.createElement("div")
  block1.classList ="block green red-text";
  block1.innerHTML = "<h1>WOMAN</h1>"

  const block2 = document.createElement("div")
  block2.classList ="block white green-text";
  block2.innerHTML = "<h1>LIFE</h1>"

  const block3 = document.createElement("div")
  block3.classList ="block red white-text";
  block3.innerHTML = "<h1>FREEDOM</h1>"

  document.body.appendChild(block1);
  document.body.appendChild(block2);
  document.body.appendChild(block3);
}

createBlockElements();
