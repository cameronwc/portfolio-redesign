// Require the framework and instantiate it
const path = require('path')

const fastify = require('fastify')({ logger: true })
const helmet = require('@fastify/helmet')
const Flickr = require('flickr-sdk')

const PORT = process.env.PORT || 3000;

// fastify.register(
//     helmet
// )

fastify.register(require('@fastify/view'), {
    engine: {
        handlebars: require('handlebars')
    },
    includeViewExtension: true,
    options: {
        partials: {
            head: '/views/partials/head.hbs',
            header: '/views/partials/header.hbs',
            footer: '/views/partials/footer.hbs'
        }
    }
});


fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '/public'),
    prefix: '/public/', // optional: default '/'
})

fastify.get('/', (req, reply) => {
    reply.view('/views/layouts/index', {});
});

fastify.get('/photography', function (req, reply) {
    const flickr = new Flickr(process.env.FLICKR_API_KEY);
    const links = [];

    flickr.people.getPhotos({
        user_id: '193240606@N03'
    }).then(function (res) {
        res.body.photos.photo.forEach((photo, idx) => {
            if (idx < 50){
                links.push({
                    'url': `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
                    'thumbnail': `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`
                })
            }
        })
        reply.view('/views/layouts/photography', {links: links});
    }).catch(function (err) {
        console.error('bonk', err);
    });
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(PORT, '0.0.0.0')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()

