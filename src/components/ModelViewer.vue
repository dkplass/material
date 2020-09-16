<template>
  <div id="scene-container" ref="sceneContainer"></div>
</template>

<script>
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default {
  name: "ModelViewer",
  props: {
    modelObject: String
  },
  data() {
    return {
      container: null,
      scene: null,
      camera: null,
      controls: null,
      renderer: null,
      content: null,
      material: null,
      pmremGenerator: null,
      geometry: null,
      lights: [],
      state: {
        // camera
        camera: {
          fov: 60,
          aspect: 0,
          near: 0.1,
          far: 1000
        },
        // Lights
        light: {
          exposure: 1.0,
          textureEncoding: "sRGB",
          ambientIntensity: 0.3,
          ambientColor: 0xffffff,
          directIntensity: 0.8 * Math.PI, // TODO(#116)
          directColor: 0xffffff,
          bgColor1: "#ffffff",
          bgColor2: "#353535"
        }
      }
    };
  },
  mounted() {
    this.init();
    this.loadGLTF();
    this.$nextTick(() => {
      window.addEventListener("resize", this.resize, false);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.resize, false);
  },
  methods: {
    init() {
      // set container
      this.container = this.$refs.sceneContainer;

      this.scene = new Three.Scene();
      this.scene.background = new Three.Color(0x3b3b3b);

      this.createCamera();

      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.physicallyCorrectLights = true;
      this.renderer.outputEncoding = Three.sRGBEncoding;
      this.renderer.shadowMap.enabled = true;
      this.renderer.gammaFactor = 2.2;
      this.renderer.setClearColor(0xcccccc);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

      this.pmremGenerator = new Three.PMREMGenerator(this.renderer);
      this.pmremGenerator.compileEquirectangularShader();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.autoRotate = false;
      this.controls.autoRotateSpeed = -10;
      this.controls.screenSpacePanning = true;

      this.container.appendChild(this.renderer.domElement);

      this.animate();
      // requestAnimationFrame(this.animate);
    },
    createCamera() {
      let { fov, aspect, near, far } = { ...this.state.camera };

      aspect = this.container.clientWidth / this.container.clientHeight;

      const camera = new Three.PerspectiveCamera(fov, aspect, near, far);

      camera.position.set(0, 5, 10);

      this.camera = camera;

      this.scene.add(this.camera);
    },
    load() {
      return new Promise((resolve, reject) => {
        const manager = new Three.LoadingManager();

        manager.setURLModifier(url => {
          return "/materialball/static/PBR_TestBox/" + url;
        });

        const loader = new OBJLoader(manager);

        loader.load(
          "PBR_TestBox.obj",
          obj => {
            const _obj = obj;

            this.setContent(_obj);
            // this.scene.add(_obj);
            resolve(_obj);
          },
          undefined,
          reject
        );
      });
    },
    loadGLTF() {
      return new Promise((resolve, reject) => {
        // const manager = new Three.LoadingManager();

        // manager.setURLModifier(url => {
        //   return "/materialball/static/" + url;
        // });

        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/materialball/static/");
        loader.setDRACOLoader(dracoLoader);

        loader.load(
          "/materialball/static/YL-O009_M0545.glb",
          gltf => {
            const scene = gltf.scene;

            this.setContent(scene);

            resolve(gltf);
          },
          undefined,
          reject
        );
      });
    },
    setContent(object) {
      this.clear();

      const box = new Three.Box3().setFromObject(object);
      const size = box.getSize(new Three.Vector3()).length();
      const center = box.getCenter(new Three.Vector3());

      this.controls.reset();

      object.position.x += object.position.x - center.x;
      object.position.y += object.position.y - center.y;
      object.position.z += object.position.z - center.z;

      this.controls.maxDistance = size * 10;

      this.camera.near = size / 100;
      this.camera.far = size * 100;
      this.camera.updateProjectionMatrix();
      this.camera.position.x += size / 2.0;
      this.camera.position.y += size / 5.0;
      this.camera.position.z += size / 2.0;
      this.camera.lookAt(center);

      this.controls.saveState();

      this.scene.add(object);
      this.content = object;

      // this.updateEnvironmentTexture();
      this.updateLights();
      // this.updateMaterialTexture();
    },
    updateLights() {
      const state = this.state;
      const lights = this.lights;

      if (!lights.length) {
        this.addLights();
      } else {
        this.removeLights();
      }

      this.renderer.toneMappingExposure = state.exposure;

      if (lights === 2) {
        lights[0].intensity = state.ambientIntensity;
        lights[0].color.setHex(state.ambientColor);
        lights[1].intensity = state.directIntensity;
        lights[1].color.setHex(state.directColor);
      }
    },
    addLights() {
      const state = this.state;

      const light1 = new Three.AmbientLight(state.ambientColor, state.ambientIntensity);
      light1.name = "ambient_light";
      this.camera.add(light1);

      const light2 = new Three.DirectionalLight(state.directColor, state.directIntensity);
      light2.position.set(0, 0, 0);
      light2.name = "main_light";
      this.camera.add(light2);

      this.lights.push(light1, light2);
    },
    removeLights() {
      this.lights.forEach(light => light.parent.remove(light));
      this.lights.length = 0;
    },
    updateEnvironmentTexture() {
      this.getEnvironmentTexture().then(({ envMap }) => {
        // this.scene.background = envMap;
        this.scene.environment = envMap;
      });
    },
    getEnvironmentTexture() {
      return new Promise((resolve, reject) => {
        new RGBELoader().setDataType(Three.UnsignedByteType).load(
          "/materialball/static/PBR_TestBox/GSG_PRO_STUDIOS_METAL_008_sm.hdr",
          texture => {
            const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
            this.pmremGenerator.dispose();

            resolve({ envMap });
          },
          undefined,
          reject
        );
      });
    },
    updateMaterialTexture() {
      const textures = {
        map: {
          url: "PBR_TestBox_lambert1_BaseColor.png",
          value: null
        },
        normalMap: {
          url: "PBR_TestBox_lambert1_Normal.png",
          value: null
        },
        roughnessMap: {
          url: "PBR_TestBox_lambert1_TEST.png",
          value: null
        },
        metalnessMap: {
          url: "PBR_TestBox_lambert1_TEST.png",
          value: null
        }
      };

      const texturePromises = [];

      const manager = new Three.LoadingManager();

      manager.setURLModifier(url => {
        return "/materialball/static/PBR_TestBox/" + url;
      });

      const loader = new Three.TextureLoader(manager);

      for (let key in textures) {
        texturePromises.push(
          new Promise((resolve, reject) => {
            const entry = textures[key];
            const url = entry.url;

            loader.load(
              url,
              texture => {
                entry.value = texture;
                resolve(entry);
              },
              undefined,
              reject
            );
          })
        );
      }

      Promise.all(texturePromises).then(() => {
        const material = new Three.MeshStandardMaterial({
          color: 0x7f7f7f,
          map: textures.map.value,
          normalMap: textures.normalMap.value,
          roughnessMap: textures.roughnessMap.value,
          metalnessMap: textures.metalnessMap.value,
          metalness: 1
        });

        this.content.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = material;
            o.material.map.encoding = Three.sRGBEncoding;
            o.material.map.format = Three.RGBFormat;
            o.material.normalMap.format = Three.RGBFormat;
            o.material.roughnessMap.format = Three.RGBFormat;
            o.material.metalnessMap.format = Three.RGBFormat;
            o.material.needsUpdate = true;
          }
        });

        this.scene.add(this.content);
      });
      // const textureLoader = new Three.TextureLoader(manager);
      // let _material = new Three.MeshStandardMaterial({
      //   color: 0x7f7f7f,
      //   // map: this.getMaterialTexture("PBR_TestBox_lambert1_BaseColor.png").then(t => t)
      // });
      // this.getMaterialTexture("PBR_TestBox_lambert1_BaseColor.png").then(({ texture }) => {
      //   _material.map = texture;
      // });
      // console.log(_material);
      // // this.traverseMaterials(this.content, material => {
      // //   material = _material;
      // //   if (material.map) material.map.encoding = Three.sRGBEncoding;
      // //   material.needsUpdate = true;
      // // });
      // // console.log(_material);
      // // this.getMaterialTexture("PBR_TestBox_lambert1_BaseColor.png").then((t) => {
      // //   _material.map = t;
      // // });
      // // console.log(a);
      // this.content.traverse(o => {
      //     if (o.isMesh) {
      //       o.castShadow = true;
      //       o.receiveShadow = true;
      //       o.material = _material;
      //       console.log(o.material);
      //       o.material.map.encoding = Three.sRGBEncoding;
      //       o.material.map.format = Three.RGBFormat;
      //       o.material.normalMap.format = Three.RGBFormat;
      //       o.material.roughnessMap.format = Three.RGBFormat;
      //       o.material.metalnessMap.format = Three.RGBFormat;
      //       o.material.needsUpdate = true;
      //     }
      //   });
      // this.scene.add(this.content);
    },
    getMaterialTexture(url) {
      return new Promise((resolve, reject) => {
        const manager = new Three.LoadingManager();

        manager.setURLModifier(url => {
          return "/materialball/static/PBR_TestBox/" + url;
        });

        const textureLoader = new Three.TextureLoader(manager);

        textureLoader.load(
          url,
          texture => {
            resolve(texture);
          },
          undefined,
          reject
        );
      });
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.controls.update();

      this.render();
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    resize() {
      const { clientWidth, clientHeight } = this.container;

      this.camera.aspect = clientWidth / clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(clientWidth, clientHeight);
    },
    clear() {
      const Map_Names = [
        "map",
        "aoMap",
        "emissiveMap",
        "glossinessMap",
        "metalnessMap",
        "normalMap",
        "roughnessMap",
        "specularMap"
      ];

      if (!this.content) return;

      this.scene.remove(this.content);

      // dispose geometry
      this.content.traverse(node => {
        if (!node.isMesh) return;
        node.geometry.dispose();
      });

      // dispose textures
      this.traverseMaterials(this.content, material => {
        Map_Names.forEach(map => {
          if (material[map]) material[map].dispose();
        });
      });
    },
    traverseMaterials(object, callback) {
      object.traverse(node => {
        if (!node.isMesh) return;

        const material = Array.isArray(node.material) ? node.material : [node.material];

        material.forEach(callback);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#scene-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
