mongo danalica --quiet --eval "db.createUser(
    { 
        user: 'd5h2S8m0I',
        pwd: 'hf3w2nE2',
        roles: [
            {
                role: 'readWrite', db: 'danalica'
            }
        ]
    }
)"

mongo danalica -u d5h2S8m0I -p hf3w2nE2 --eval "db.bundles.insertMany(
    [{
        title: 'بسته آزمایشی نوع اول',
        category: 'آزمایشی',
        hit: '3000',
        duration: '30',
        hitPeriod: '30',
        description: 'بسته آزمایشی برای مدت محدود',
        status: 'active',
    },
    {
        title: 'بسته آزمایشی نوع دوم',
        category: 'آزمایشی',
        hit: '6000',
        duration: '30',
        hitPeriod: '30',
        description: 'بسته آزمایشی برای مدت محدود',
        status: 'active',
    }]
)"

mongo danalica -u d5h2S8m0I -p hf3w2nE2 --eval "db.bundles.insertMany(
    [{
        username: 'admin',
        password: 'd02h7)s82__2',
        role: 'admin',
        email: 'info@danalica.com',
        phone: '',
        description: '',
        validation_code: '',
        status: 'active'
    },
    {
        username: 'crm_user',
        password: 'j0f2bx4w1',
        role: 'user',
        email: 'crm@danalica.com',
        phone: '',
        description: '',
        validation_code: '',
        status: 'active'
    }]
)"
