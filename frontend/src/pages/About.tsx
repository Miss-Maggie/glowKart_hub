import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Target, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in putting local communities at the heart of everything we do."
    },
    {
      icon: Target,
      title: "Local Focus",
      description: "Supporting neighborhood businesses and keeping money within communities."
    },
    {
      icon: Heart,
      title: "Authentic Connections",
      description: "Fostering genuine relationships between businesses and their neighbors."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Creating a secure platform where everyone can shop and sell with confidence."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-primary">About GlowKart Hub</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Strengthening Local Communities
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            GlowKart Hub was born from a simple idea: local businesses and their communities 
            should be seamlessly connected. We're building the bridge that brings neighbors together.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Our Mission</CardTitle>
            <CardDescription className="text-lg">
              To empower local businesses and communities by creating meaningful connections 
              that keep neighborhoods thriving.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe that when local businesses succeed, entire communities flourish. 
              That's why we've created a platform that makes it easier than ever for 
              neighbors to discover, support, and celebrate the amazing businesses in their area.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Join Our Community</CardTitle>
            <CardDescription className="text-lg">
              Ready to be part of the local commerce revolution?
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/register">Get Started Today</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/businesses">Explore Businesses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;