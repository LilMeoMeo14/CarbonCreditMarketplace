import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useRouter } from '../../../contexts/RouterContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

export function Blog() {
  const { navigateTo } = useRouter();

  const blogPosts = [
    {
      id: '1',
      title: 'Tín chỉ carbon là gì và tại sao xe điện có thể tạo ra chúng?',
      excerpt: 'Tìm hiểu về cơ chế tạo tín chỉ carbon từ việc sử dụng xe điện và cách nó giúp giảm phát thải CO2 toàn cầu.',
      author: 'Admin',
      date: '15/09/2025',
      readTime: '5 phút',
      category: 'Kiến thức',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=400&fit=crop'
    },
    {
      id: '2',
      title: 'Hướng dẫn đăng ký và xác minh tài khoản chủ xe điện',
      excerpt: 'Các bước chi tiết để đăng ký tài khoản, xác minh thông tin và bắt đầu kiếm tiền từ xe điện của bạn.',
      author: 'Support Team',
      date: '10/09/2025',
      readTime: '8 phút',
      category: 'Hướng dẫn',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
    },
    {
      id: '3',
      title: 'Quy trình xác minh tín chỉ carbon của CVA',
      excerpt: 'Tìm hiểu cách CVA (Carbon Verification Asia) xác minh và chứng nhận tín chỉ carbon của bạn.',
      author: 'CVA Team',
      date: '05/09/2025',
      readTime: '6 phút',
      category: 'Quy trình',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'
    },
    {
      id: '4',
      title: 'Top 5 lợi ích khi tham gia thị trường tín chỉ carbon',
      excerpt: 'Khám phá những lợi ích tài chính và môi trường khi tham gia vào thị trường tín chỉ carbon.',
      author: 'Admin',
      date: '01/09/2025',
      readTime: '4 phút',
      category: 'Tin tức',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop'
    },
    {
      id: '5',
      title: 'Xu hướng thị trường tín chỉ carbon tại Việt Nam năm 2025',
      excerpt: 'Phân tích thị trường và dự báo xu hướng tăng trưởng của tín chỉ carbon từ xe điện tại Việt Nam.',
      author: 'Market Analyst',
      date: '28/08/2025',
      readTime: '10 phút',
      category: 'Phân tích',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
    },
    {
      id: '6',
      title: 'Câu chuyện thành công: Chủ xe VinFast kiếm 5 triệu/tháng từ tín chỉ',
      excerpt: 'Chia sẻ trực tiếp từ anh Nguyễn Văn A về hành trình kiếm tiền từ tín chỉ carbon của xe điện.',
      author: 'Admin',
      date: '25/08/2025',
      readTime: '7 phút',
      category: 'Case Study',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop'
    },
  ];

  const categories = ['Tất cả', 'Kiến thức', 'Hướng dẫn', 'Quy trình', 'Tin tức', 'Phân tích', 'Case Study'];
  const [selectedCategory, setSelectedCategory] = React.useState('Tất cả');

  const filteredPosts = selectedCategory === 'Tất cả' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <PublicLayout>
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full mb-6">
              <span className="text-primary font-medium">📰 Blog & Tin Tức</span>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Blog & Tin Tức</h1>
            <p className="text-muted-foreground text-lg">
              Cập nhật thông tin mới nhất về thị trường tín chỉ carbon, 
              hướng dẫn sử dụng và câu chuyện thành công
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer border-2 hover:border-primary/50 group">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${post.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all" />
                <Badge className="absolute top-4 left-4 bg-primary">{post.category}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center border-2 border-primary/20">
          <h2 className="mb-2">Đăng ký nhận tin tức 📬</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Nhận thông tin mới nhất về tín chỉ carbon và thị trường xe điện
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-medium">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
