require("babel/register")

const app       = require("koa")()
const koaBody   = require("koa-better-body")
const hbs       = require("koa-hbs")
const logger    = require("koa-logger")
const koaMount  = require("koa-mount")
const passport  = require("koa-passport")
const KoaRouter = require("koa-router")
const session   = require("koa-session")
const koaStatic = require("koa-static")
const path      = require("path")

const r = require("rethinkdbdash")()

let router = new KoaRouter()

app.use(koaBody())
app.use(logger())

app.keys = [ "1234567890" ]
app.use(session(app))

app.use(hbs.middleware({
  viewPath: path.join(__dirname, "/views")
}))

// app.use(function *() {
//   var n = this.session.views || 0

//   this.session.views = ++n
//   this.body = n + " views"
// })

router.get("/", function *() {
  yield this.render("index", { title: "Quoth", body: "Hi!" })
})

router.get("/data", function *() {
  let results = yield r.db("quoth").table("users").run()

  this.type = "application/json"
  this.body = JSON.stringify(results)
})

app.use(router.middleware())

app.listen(3000, function () {
  console.log("Listening on port 3000.")
})

