import { CharacterMapper } from '../mapper/buss/CharacterMapper';
import type { Character }  from '@share/dbModels/Character';
import elogger from '../util/ElogUtil';
// 定义数据存储路径
const characterMapper = CharacterMapper.getInstance();

// 获取所有人物角色
export async function getAllCharactersByBookId(bookId: string): Promise<Character[]> {
  return characterMapper.findAll();
}

// 添加新角色
export async function addCharacter(character: Omit<Character,'id' | 'create_time' | 'update_time'>): Promise<Character> {  
  const newCharacter = {
    ...character,
    create_time: Date.now(),
    update_time: Date.now(),
    id: ''
  } as Character;
  elogger.getInstance().info(`Adding new character: ${JSON.stringify(newCharacter)}`);
  return characterMapper.create(newCharacter);
}

// 导出供渲染进程调用的方法
export const characterService = {
  getAllCharactersByBookId,
  addCharacter
};