import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { useRouter } from '../../../contexts/RouterContext';
import { FileText, BookOpen, Video, Download } from 'lucide-react';

export function Resources() {
  const { navigateTo } = useRouter();

  const blogPosts = [
    {
      title: 'Understanding Carbon Credits for EV Owners',
      excerpt: 'Learn how electric vehicles contribute to carbon credit generation and how you can monetize your environmental impact.',
      date: '2025-10-01',
      readTime: '5 min read',
    },
    {
      title: 'How to Maximize Your Carbon Savings',
      excerpt: 'Tips and strategies for optimizing your EV usage to generate more carbon credits.',
      date: '2025-09-25',
      readTime: '7 min read',
    },
    {
      title: 'The Future of Carbon Trading',
      excerpt: 'Exploring the growing carbon credit marketplace and its role in climate action.',
      date: '2025-09-15',
      readTime: '10 min read',
    },
  ];

  const caseStudies = [
    {
      title: 'VinFast Owner Earns $500 in First Quarter',
      description: 'How a VinFast VF8 owner in Hanoi generated and sold carbon credits',
      metrics: '1,250 kg CO₂ saved',
    },
    {
      title: 'Corporate Fleet Reduces Emissions by 50%',
      description: 'Large enterprise transitions to EVs and monetizes carbon savings',
      metrics: '50,000 kg CO₂ offset',
    },
  ];

  const downloads = [
    {
      icon: FileText,
      title: 'Carbon Credit Whitepaper',
      description: 'Technical documentation on our methodology',
      size: '2.5 MB',
    },
    {
      icon: BookOpen,
      title: 'EV Owner Guide',
      description: 'Complete guide to getting started',
      size: '1.8 MB',
    },
    {
      icon: Video,
      title: 'Video Tutorial Series',
      description: 'Step-by-step video walkthroughs',
      size: 'Online',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">Resources & Learning Center</h1>
            <p className="text-muted-foreground">
              Educational content, case studies, and tools to help you succeed on our platform
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4" />
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-8">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {caseStudies.map((study, index) => (
              <Card key={index}>
                <CardContent className="p-8">
                  <h3 className="mb-2">{study.title}</h3>
                  <p className="text-muted-foreground mb-4">{study.description}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                    <span className="text-primary font-semibold">{study.metrics}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8">Downloads & Documentation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {downloads.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="mb-2">{item.title}</h4>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{item.size}</span>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Create your account today and start earning from your EV
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigateTo('/register')}>
            Sign Up Now
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
