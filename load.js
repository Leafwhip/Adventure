var assets={};
async function loadAssets() {
    const manifest={
        bundles: [{
            name:'all',
            assets: [
                {
                    name: 'character',
                    srcs: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/character.png?v=1699594001026'
                }
            ]
        }]
    }
    await Assets.init({ manifest: manifest });
    const all = await Assets.loadBundle(['all']);
    for(let key in all){
        assets[key]=all[key];
    }
}