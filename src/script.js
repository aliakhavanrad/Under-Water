import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import planeVertexShader from './shaders/plane/vertex.glsl'
import planeFragmentShader from './shaders/plane/fragment.glsl'
import { CubeCamera } from 'three'

/**
 * Constants
 */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xeaeafa)
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

    mouse.x = newPositionX
    mouse.y = newPositionY

})

const raycaster = new THREE.Raycaster();


/**
 * Loaders
 */

 const textureLoader = new THREE.TextureLoader();    



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.01, 10000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.minPolarAngle = 3 * Math.PI / 8; // radians
// controls.maxPolarAngle = 5 * Math.PI / 8; // radians

// controls.minAzimuthAngle = - Math.PI / 16
// controls.maxAzimuthAngle = Math.PI / 16
// controls.minDistance = 50
// controls.maxDistance = 450

/**
 * Axis Helper
 */
// const axisHelper = new THREE.AxesHelper(100);
// scene.add(axisHelper)

/**
 * Light
 */

 const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
 directionalLight.position.set(0, 0, 1.0)
 scene.add(directionalLight);

  const lightTarget = new THREE.Object3D();
  directionalLight.target = lightTarget;
scene.add(lightTarget)


const ambientLight = new THREE.AmbientLight(0x00aa00, 0.5)
scene.add(ambientLight)

 /**
  * box
  */

 const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({color: 0x00aa00})
 )

 
box.rotation.set(1, 0, -1)
box.position.set(0, 0, -1)

 //scene.add(box)


/**
 * Content Plane
 */

 const contentPlaneGeo = new THREE.PlaneGeometry(3, 3);

 const texture = textureLoader.load('textures/mahsa.jpg')
 const contentPlaneMaterial = new THREE.MeshStandardMaterial({
   
   map: texture
 });
 const contentPlane = new THREE.Mesh(contentPlaneGeo, contentPlaneMaterial);
 contentPlane.position.set(0, 0, -1)
 scene.add(contentPlane);
 
 

 /**
  * Plane
  */

  const planeGeometry = new THREE.PlaneGeometry(4, 4, 100, 100);
  const planeMaterial = new THREE.ShaderMaterial(
    {
      transparent: true,
      uniforms: THREE.UniformsUtils.merge( 
                                          [
                                            {
                                              'uTime': { value: null },
                                              'uMousePosition': { value: new THREE.Vector2(0.0, 0.0)},
                                            },
                                            THREE.ShaderLib[ 'phong' ].uniforms
                                          ]),
      vertexShader: planeVertexShader,
      fragmentShader: planeFragmentShader,
      
    })

 
    planeMaterial.lights = true;

   // Material attributes from THREE.MeshPhongMaterial
   planeMaterial.color = new THREE.Color( 0x1220d0 );
   planeMaterial.specular = new THREE.Color( 0x1280a3 );
   planeMaterial.shininess = 30;

   // Sets the uniforms with the material values
   planeMaterial.uniforms[ 'diffuse' ] =  {value : planeMaterial.color}
   planeMaterial.uniforms[ 'specular' ] = {value : planeMaterial.specular}
   planeMaterial.uniforms[ 'shininess' ] = {value :  planeMaterial.shininess};
   planeMaterial.uniforms[ 'opacity' ]= {value : 0.8};
 
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.position.set(0, 0, -1);

  camera.add( plane );
  //scene.add(plane)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

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



    box.rotateZ(deltaTime)


    planeMaterial.uniforms.uTime.value = elapsedTime;


    /**
     * Raycaster
     */
    raycaster.setFromCamera(mouse, camera);

    let intersect = raycaster.intersectObject(plane);
    if(intersect.length){

      lightTarget.position.set( -intersect[0].point.x, -intersect[0].point.y, intersect[0].point.z)
      //lightTarget.updateMatrixWorld();

      planeMaterial.uniforms.uMousePosition.value = intersect[0].uv;
      //positionUniforms[MOUSE_POSITION_UNIFORM].value.set(intersect[0].uv.x,intersect[0].uv.y)
    }else{
      
    }


    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick();


// we can use gsap to move the light to the pointer, especially when the page is loaded.
// we need to create content and change it with scrolling
// for the load stage, we can slowly enter the plane into the screen, so it seems the screen is filled with water (Maybe with the scound of the water. the sound can be persistant)
// we need to disable the camera controls
// 