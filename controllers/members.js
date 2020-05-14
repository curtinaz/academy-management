const fs = require('fs')
const data = require('../data.json')
const { date, born, age } = require('../utils.js')

exports.index = function (req, res) {
    return res.render("members/index", { members: data.members })
}

exports.create = function (req, res) {
    return res.render("members/create")
}

exports.show = function (req, res) {

    const { id } = req.params

    const foundMember = data.members.find(function(member) {
        return id == member.id
    })

    if (!foundMember) return res.send ("Member not found!")

    const member = {
        ...foundMember,
        age: age(foundMember.birth),
    }

    return res.render('./members/show', { member })
}   

exports.post = function (req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
        return res.send ("Por favor, preencha todos os campos!")
        }
    }
    
    let { avatar_url, name, birth, gender, services } = req.body

    birth = Date.parse(req.body.birth)
    const created_at = Date.now()
    const id = Number(data.members.length + 1)

    data.members.push({
        id,
        avatar_url,
        name,
        gender,
        services,
        birth,
        created_at
    }) // [{...},{...}]

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if (err) return res.send("Write File error!")

    return res.redirect(`/members/${id}`)
    })

}

exports.edit = function (req, res) {

    const { id } = req.params

    const foundMember = data.members.find(function(member) {
        return id == member.id
    })

    if (!foundMember) return res.send ("Member not found!")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth)
    }

    return res.render("members/edit", { member, foundMember })
}

exports.put = function (req, res) {

    let index = 0

    const { id } = req.body

    const foundMember = data.members.find(function(member, foundIndex) {
        if (id == member.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundMember) return res.send ("Member not found!")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send ("Write error!")
        
        return res.redirect (`/members/${id}`)
    })
}

exports.delete = function (req, res) {

    return res.redirect (`/members/`)
}