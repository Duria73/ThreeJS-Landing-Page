
import React, { Component, useRef } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from "dat.gui"
import gsap from "gsap"

import alpha12 from "./images/alpha4.png"
import tall from "./images/texture.jpg"
class App extends Component {
    // customCursorFollow = (e) => {
    //   console.log(e.clientX / window.innerWidth)
    //   console.log(e.clientY)
    // };

  componentDidMount() {
  

    // document.addEventListener('mousemove', this.customCursorFollow);
    window.addEventListener( 'mousemove', onMouseMove, false );

  

    const loader = new THREE.TextureLoader()
    const alpha = loader.load({alpha12})
    const texture = loader.load({tall})
    //threeJS Specific

    const gui = new dat.GUI()
    const world = {
      plane: {
        width: 19,
        height: 19,
        widthSegments: 50,
        heightSegments: 50,
        
      }
    }
      gui.add(world.plane, "width", 1, 20).
        onChange(generatePlane)
      gui.add(world.plane, "widthSegments", 1, 100).
        onChange(generatePlane) 
      gui.add(world.plane, "height", 1, 20).
      onChange(generatePlane)
      gui.add(world.plane, "heightSegments", 1, 100).
      onChange(generatePlane)

      function generatePlane() {
        planeMesh.geometry.dispose()
        planeMesh.geometry = new THREE.PlaneGeometry(
          world.plane.width,
          world.plane.height,
          world.plane.widthSegments,
          world.plane.heightSegments
          )

      
        
    const {array} = planeMesh.geometry.attributes.position;

        for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      array[i + 2] = z + Math.random()
    }
       const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
      colors.push(0.31,0.31,0.31)
    }

    planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))
      }

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2();
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(devicePixelRatio)
    document.body.appendChild( renderer.domElement );
    //Geometry

    const planeGeometry = new THREE.PlaneBufferGeometry(400,400,200,200);
    const planeMaterial = new THREE.MeshPhongMaterial({
      
      side: THREE.DoubleSide,
      flatShading: THREE.FlatShading,
      vertexColors: true
      // alphaMap: alpha,
      //  displacementMap: height,
        // displacementScale: .6,
    // transparent: true,
    // depthTest: false
      })
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

    new OrbitControls(camera, renderer.domElement)
    camera.position.z = 50;
    scene.add(planeMesh)

    //vertex position randomization
    const {array} = planeMesh.geometry.attributes.position;
       const randomValues = []
    for (let i = 0; i < array.length; i++) {
      
      if (i % 3 === 0) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      array[i] = x + (Math.random() - 0.5) * 3
      array[i + 1] = y + (Math.random() - 0.5) * 3
      array[i + 2] = z + (Math.random() * 3)
      }

      randomValues.push(Math.random() * Math.PI * 2)
    }

    planeMesh.geometry.attributes.position.randomValues = randomValues
    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

    //color attribute RGb
    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
      colors.push(0.31,0.31,0.31)
    }

    planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))

    //light front
    const light = new THREE.DirectionalLight(
      0xffffff, 1
    )
      light.position.set(0, 1, 1)
      scene.add(light)

    //light back
    const backLight = new THREE.DirectionalLight(
      0xffffff, 1
    )
      light.position.set(0, 0, -1)
      scene.add(backLight)

    //point Light
    const pointLight = new THREE.PointLight(0x004150, 2)
    pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


gui.add(pointLight.position, "x")
gui.add(pointLight.position, "y")
gui.add(pointLight.position, "z")

const col = { color: "#787878" }
gui.addColor(col, "color").onChange(() => {
    pointLight.color.set(col.color)
})

    renderer.render( scene, camera );

    
function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // console.log(mouse.x)
}

  let frame = 0

    function animate() {
      requestAnimationFrame(animate)
      frame += 0.1
      renderer.render(scene, camera)
      // planeMesh.rotation.z += 0.001

      const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position
  
      for(let i = 0; i < array.length; i += 3) {
        //x
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.003
        
        //y
        array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.003
        
        // // //z
        // array[i + 2] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.003

       
      }

      planeMesh.geometry.attributes.position.needsUpdate = true

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(planeMesh)
      if (intersects.length > 0) {
        const {color} = intersects[0].object.geometry.attributes

        // //vertex1
        // color.setX(intersects[0].face.a,0.71)
        // color.setY(intersects[0].face.a,0.71)
        // color.setZ(intersects[0].face.a,0.71)

        // //vertext 2
        // color.setX(intersects[0].face.b,0.71)
        // color.setY(intersects[0].face.b,0.71)
        // color.setZ(intersects[0].face.b,0.71)

        // //vertex 3
        // color.setX(intersects[0].face.c,0.71)
        // color.setY(intersects[0].face.c,0.71)
        // color.setZ(intersects[0].face.c,0.71)

        // intersects[0].object.geometry.attributes.color.needsUpdate = true

        const initialColor = {
          r: 0.31,
          g: 0.31,
          b: 0.31
        }
        const hoverColor = {
          r: 0.71,
          g: 0.71,
          b: 0.71
        }

        gsap.to(hoverColor, {
          r: initialColor.r,
          g: initialColor.g,
          b: initialColor.b,
          duration: 1,
          onUpdate: () => {
                   //vertex1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        //vertext 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)

        //vertex 3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.needsUpdate = true;
          }
        })
      }
    }

    animate()
  }

  
  render() {
    return (
      <div />
    )
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);