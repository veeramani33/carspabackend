const Service = require('../models/Service')
const Note = require('../models/Note')

// @desc Get all services
// @route GET /services
// @access Private
const getAllServices = async( req, res) => {
    const result = await Service.find().lean()

    if(!result.length){
       return res.status(400).json({ message: 'No Sevices Found'})
    }

    res.json(result)
}

// @desc Create new service
// @route POST /services
// @access Private
const createNewService = async( req, res ) => {
    const {servicename, price} = req.body

    if(!servicename || !price ){
        return res.status(400).json({message: 'All fields are required'})
    }

    const duplicate = await Service.findOne({servicename}).collation({ locale: 'en', strength: 2 }).lean()

    if(duplicate){
        return res.status(409).json({message: 'Service Name is already existing'})
    }
    const service = await Service.create({ servicename, price })
    if (service) { 
        return res.status(201).json({ message: 'New service created' })
    } else {
        return res.status(400).json({ message: 'Invalid service data received' })
    }
}

// @desc Update a service
// @route PATCH /services
// @access Private
const updateService = async(req, res) => {
    const {id, servicename, price, active} = req.body

    if(!id || !servicename || !price || typeof active !== 'boolean'){
        return res.status(400).json({message: 'All fields are required'})
    }

    const service =  await Service.findById(id).exec()
    if(!service){
        return re.status(400).json({message: 'Service Not Found'})
    }
    const duplicate = await Service.findOne({servicename}).collation({ locale: 'en', strength: 2 }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'service name already existing'})
    }

    service.servicename = servicename
    service.price = price
    service.active = active

    const result = await service.save()

    res.json(`'${service.servicename}' updated`)
}

// @desc Delete a service
// @route DELETE /services
// @access Private
const deleteService = async(req, res) => {
    const {id} = req.body
    
    if(!id) {
        return res.status(400).json({message: 'ID required'})
    }

    const service = await Service.findById(id).exec()
    if(!service){
        return res.statsu(400).json({mesage: ' Service ID Not Found'})
    }

    const verifyNote = await Note.findOne({service: id}).lean().exec()
    if(verifyNote){
        return res.status(400).json({message: 'Service not allowed to delete since using in notes'})
    }
    const result = await service.deleteOne()
    const reply = `${service.servicename} Deleted`
    res.json(reply);
}

module.exports = {
    getAllServices,
    createNewService,
    updateService,
    deleteService
}