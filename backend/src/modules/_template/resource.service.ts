import { resourceRepository } from './resource.repository.js'
const list = () => resourceRepository.findAll()
export const resourceService = { list }
