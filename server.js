// Require the framework and instantiate it
const path = require('path')

const fastify = require('fastify')({ logger: true })
const helmet = require('fastify-helmet')

const PORT = process.env.PORT || 3000;

const AWS = require('aws-sdk')
// fastify.register(
//     helmet
// )

fastify.register(require('point-of-view'), {
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


fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '/public'),
    prefix: '/public/', // optional: default '/'
})

fastify.get('/', (req, reply) => {
    reply.view('/views/layouts/index', {});
});

fastify.get('/photography', function (req, reply) {
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    var bucketParams = {
        Bucket: 'public-photos-for-portfolio',
    };

    const links = []
    s3.listObjects(bucketParams, function (err, data) {
        data.Contents.forEach(element => {
            const name = element.Key.replace('example/', '')
            if ((name.substr(name.length - 4) == 'jpeg' || name.substr(name.length - 3) == 'jpg') && name[0] != '.' && name.substr(name.length - 14) != 'thumbnail.jpeg') {
                const thumbnail = name.split('.')[0] + '_thumbnail.jpeg' 
                links.push({'url': 'https://public-photos-for-portfolio.s3.amazonaws.com/example/' + name, 'thumbnail': 'https://public-photos-for-portfolio.s3.amazonaws.com/example/' + thumbnail})
            }
        });
        console.log(links)
        // return reply.sendFile('photography.html', links)
        reply.view('/views/layouts/photography', {links: links});
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

