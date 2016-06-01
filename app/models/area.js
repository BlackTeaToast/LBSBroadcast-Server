/**
 * test
 * @param {String} name
 * @param {Date} createdTime
 * @param {String} type
 * @param {Array} vertices
 */
var area = function() {
    this.name = name;
    this.createdTime = Date.now();
    this.type = type;
    this.vertices = vertices;
    this.getJson = function getJson() {
        return {
            name: name,
            createdTime: createdTime,
            type: type,
            vertices: vertices
        }
    }
}

exports = module.exports = area;
