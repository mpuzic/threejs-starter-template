import * as THREE from 'three';
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

let OrbitControls = require("three-orbit-controls")(THREE);

export default class Sketch {    
    constructor() {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild( this.renderer.domElement );
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 1;
        this.time = 0;
        this.scene = new THREE.Scene();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.addMesh();
        this.render();
    }

    addMesh() {
        this.geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        // this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                progress: { type: 'f', value: 0 },

            }
        });
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    }

    // render() {
    //     this.time += 1;
    //     this.mesh.rotation.x = this.time / 2000;
    //     this.mesh.rotation.y = this.time / 1000;
    //     this.renderer.render( this.scene, this.camera );
    //     this.renderer.setAnimationLoop( this.render.bind(this) );
    //     // Alternatively, we can use:
    //     // window.requestAnimationFrame(this.render.bind(this));
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
        this.time += 1;
        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;
        this.renderer.render( this.scene, this.camera );
        this.renderer.setAnimationLoop( this.render );
        // Alternatively, we can use:
        // window.requestAnimationFrame(this.render.bind(this));
    }
}

let sketch = new Sketch();
