// TODO: 必須用API動態取回權限清單
const permissionsList = [
  {
    LocationNo: "L001",
    LocationName: "Tag清單",
    LocationClass: "TagList"
  },
  {
    LocationNo: "L002",
    LocationName: "收藏功能",
    LocationClass: "Favorite"
  },
  {
    LocationNo: "L003",
    LocationName: "布料細部網格",
    LocationClass: "FabricMesh"
  },
  {
    LocationNo: "L004",
    LocationName: "成本單價",
    LocationClass: "CostPrice"
  },
  {
    LocationNo: "L005",
    LocationName: "物性測試表",
    LocationClass: "PhysicalMechanicalTest"
  },
  {
    LocationNo: "L006",
    LocationName: "檔案下載",
    LocationClass: "ModelFileDownload"
  },
  {
    LocationNo: "L007",
    LocationName: "樣品細節頁面",
    LocationClass: "SampleDetailPage"
  },
  {
    LocationNo: "L008",
    LocationName: "3D模型套色",
    LocationClass: "ModelColorProcess"
  }
];

export default {
  bind: function(el, binding, vnode) {
    console.log(el);
    console.log(binding);
    console.log(vnode);

    // FIXME: 處理 user null
    const storedData = JSON.parse(localStorage.getItem("vuex"));

    // FIXME: 處理 MemberLocations null
    const permissions = storedData.User.user.MemberLocations;
    console.log(permissions);

    const target = binding.value;
    console.log(target);

    console.log(permissionsList);

    // TODO: target 核對 permissions，不符合的隱藏或disable
    const permissionItem = permissions.find(
      p => p.LocationClass.toLowerCase() === target.toLowerCase()
    );
    console.log(permissionItem);
  }
};
