module.exports = {
    name: '/invite',
    run: async (req, res) => {
  
      delete require.cache[require.resolve("../frontend/HTML/invite.ejs")];
  
  
      res.render("./public/frontend/HTML/invite.ejs");
    }
  }; 
  