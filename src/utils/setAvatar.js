import conf from "../conf/conf";
export default function setAvatar(avatar){
    if(!avatar) return conf.defaultAvatarUrl;
    return avatar;
}