const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const catalog = [
  {id:1, name:'Kubernetes Mastery Course', category:'Education',    tags:['k8s','containers','devops']},
  {id:2, name:'Docker Deep Dive',          category:'Education',    tags:['docker','containers']},
  {id:3, name:'AWS Solutions Architect',   category:'Certification',tags:['aws','cloud']},
  {id:4, name:'Terraform Bootcamp',        category:'DevOps',       tags:['terraform','iac']},
  {id:5, name:'CI/CD Pipeline',            category:'DevOps',       tags:['cicd','jenkins','github']},
  {id:6, name:'Microservices Design',      category:'Architecture', tags:['microservices','api']},
  {id:7, name:'Prometheus & Grafana',      category:'Monitoring',   tags:['monitoring','observability']},
  {id:8, name:'Helm Charts Guide',         category:'Kubernetes',   tags:['helm','k8s']},
];

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ results: catalog });
  const results = catalog.filter(item =>
    item.name.toLowerCase().includes(q.toLowerCase()) ||
    item.category.toLowerCase().includes(q.toLowerCase()) ||
    item.tags.some(tag => tag.includes(q.toLowerCase()))
  );
  res.json({ results, total: results.length, query: q });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'search-service' }));
app.listen(4008, () => console.log('Search Service running on port 4008'));
