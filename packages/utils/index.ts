// 转为驼峰命名
export function toHump(name: string) {
  return name.replace(/\-(\w)/g, (_, letter) => {
    return letter.toUpperCase();
  });
}
