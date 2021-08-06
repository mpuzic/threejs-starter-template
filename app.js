import * as THREE from 'three'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TimelineMax } from 'gsap'


export default class Sketch {    
    constructor(selector) {
        // Canvas settings
        this.container = document.querySelector(selector)
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0xeeeeee, 1)
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.container.appendChild(this.renderer.domElement)

        // Camera and other stuff
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 1000)
        this.camera.position.set(0, 0, 2)
        this.scene.add(this.camera)

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true

        this.clock = new THREE.Clock()
        this.lastElapsedTime = 0
        this.isPlaying = true

        // Call other methods
        this.setupResize()
        this.resize()
        this.addObjects()
        this.render()
        this.settings()
    }

    addObjects() {
        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        // this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                progress: { type: 'f', value: 0 },
                uTime: { type: 'f', value: 0}
            },
            wireframe: false,
            transparent: false,
            side: THREE.DoubleSide
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    // render() {
    //     this.time += 1
    //     this.mesh.rotation.x = this.time / 2000
    //     this.mesh.rotation.y = this.time / 1000
    //     this.renderer.render( this.scene, this.camera )
    //     this.renderer.setAnimationLoop( this.render.bind(this) )
    //     // Alternatively, we can use:
    //     // window.requestAnimationFrame(this.render.bind(this))
    // }

    // When using arrow function syntax, we don't need to call `render.bind(this)`.
    // The `.bind()` method binds the `this` to the calling class.
    // ES6 made `this` in arrow functions reference the class rather than 
    // the calling function.
    // Arrow functions in class field properties seem useful because they’re autobind, 
    // in short, no need to add `this.handleClick = this.handleClick.bind(this)` in the constructor
    // More on this link:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#call_apply_and_bind

    render = () => {
        if (!this.isPlaying)
            return

        this.elapsedTime = this.clock.getElapsedTime()
        this.material.uniforms.uTime.value = this.elapsedTime

        this.mesh.rotation.x = this.elapsedTime
        this.mesh.rotation.y = this.elapsedTime

        this.controls.update()

        this.renderer.render(this.scene, this.camera)
        this.renderer.setAnimationLoop(this.render)
        // Alternatively, we can use:
        // window.requestAnimationFrame(this.render)
    }

    settings() {
        let that = this
        this.settings = {
            progress: 0
        }
        this.gui = new dat.GUI()
        this.gui.add(this.settings, 'progress').min(0).max(1).step(0.01)
        this.gui.add(this, 'isPlaying')
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize() {
        // Update width and height
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight

        // Update renderer
        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Update camera
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix();
    }

    stop() {
        this.isPlaying = false
    }

    play() {
        this.isPlaying = true
        this.render()
    }
}

let sketch = new Sketch('#webgl-container')
