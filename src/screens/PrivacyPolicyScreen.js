import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PrivacyPolicyScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f0f4f7" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2c5282" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.emptyView}></View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: June 10, 2024</Text>

          <View style={styles.divider} />

          <SectionWithIcon
            title="Introduction"
            iconName="information-circle"
            content='Welcome to BestWorkers ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.'
          />

          <SectionWithIcon
            title="Information We Collect"
            iconName="document-text"
            content={null}>
            <Text style={styles.subSectionTitle}>Personal Information</Text>
            <Text style={styles.paragraph}>
              When you register for an account, we may collect:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletItem}>
                • Your name, email address, phone number
              </Text>
              <Text style={styles.bulletItem}>
                • Your profession, skills, and work experience
              </Text>
              <Text style={styles.bulletItem}>
                • Location data to help connect you with nearby service
                providers or customers
              </Text>
              <Text style={styles.bulletItem}>
                • Profile picture (optional)
              </Text>
              <Text style={styles.bulletItem}>
                • Payment information (if applicable for premium services)
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>
              Service-Related Information
            </Text>
            <Text style={styles.paragraph}>
              For service providers, we collect:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletItem}>
                • Your service categories (e.g., Plumbing, Electrical work,
                Construction, etc.)
              </Text>
              <Text style={styles.bulletItem}>
                • Availability and work schedule
              </Text>
              <Text style={styles.bulletItem}>
                • Ratings and reviews from customers
              </Text>
              <Text style={styles.bulletItem}>
                • Work history within the app
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>
              Search and Interaction Data
            </Text>
            <Text style={styles.paragraph}>We collect information about:</Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletItem}>
                • Your searches for specific services or professionals
              </Text>
              <Text style={styles.bulletItem}>
                • Your interactions with other users
              </Text>
              <Text style={styles.bulletItem}>
                • Service requests and bookings
              </Text>
            </View>
          </SectionWithIcon>

          <SectionWithIcon
            title="How We Use Your Information"
            iconName="analytics"
            content={null}>
            <Text style={styles.paragraph}>
              We use the information we collect to:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletItem}>
                • Provide and maintain our service
              </Text>
              <Text style={styles.bulletItem}>
                • Connect service providers with potential customers
              </Text>
              <Text style={styles.bulletItem}>
                • Verify professional qualifications and skills
              </Text>
              <Text style={styles.bulletItem}>
                • Process transactions and send service-related notifications
              </Text>
              <Text style={styles.bulletItem}>
                • Improve our app and develop new features
              </Text>
              <Text style={styles.bulletItem}>
                • Communicate with you about updates, security alerts, and
                support messages
              </Text>
              <Text style={styles.bulletItem}>
                • Prevent fraud and ensure the security of our platform
              </Text>
            </View>
          </SectionWithIcon>

          <SectionWithIcon
            title="Sharing of Information"
            iconName="share-social"
            content={null}>
            <Text style={styles.paragraph}>We may share information:</Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletItem}>
                • With other users to facilitate service connections (e.g.,
                showing your profile to potential customers)
              </Text>
              <Text style={styles.bulletItem}>
                • With service providers who help with app operations (payment
                processors, cloud hosting)
              </Text>
              <Text style={styles.bulletItem}>
                • When required by law or to protect our rights
              </Text>
              <Text style={styles.bulletItem}>
                • During business transfers (merger, acquisition)
              </Text>
            </View>
            <Text style={styles.paragraph}>
              We do not sell your personal information to third parties.
            </Text>
          </SectionWithIcon>

          <SectionWithIcon
            title="Data Security"
            iconName="shield-checkmark"
            content="We implement appropriate security measures to protect your information. However, no electronic transmission or storage is 100% secure, so we cannot guarantee absolute security."
          />

          <SectionWithIcon
            title="Your Choices"
            iconName="options"
            content={null}>
            <Text style={styles.paragraph}>You can:</Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletItem}>
                • Update or correct your profile information in the app settings
              </Text>
              <Text style={styles.bulletItem}>
                • Adjust notification preferences
              </Text>
              <Text style={styles.bulletItem}>
                • Request deletion of your account and associated data by
                contacting us
              </Text>
              <Text style={styles.bulletItem}>
                • Opt-out of certain data collection (where applicable)
              </Text>
            </View>
          </SectionWithIcon>

          <SectionWithIcon
            title="Children's Privacy"
            iconName="people"
            content="Our app is not intended for users under 16. We do not knowingly collect information from children."
          />

          <SectionWithIcon
            title="Changes to This Policy"
            iconName="refresh"
            content="We may update this policy periodically. We will notify you of significant changes through the app or via email."
          />

          <SectionWithIcon title="Contact Us" iconName="mail" content={null}>
            <Text style={styles.paragraph}>
              If you have questions about this Privacy Policy, please contact us
              at:
            </Text>
            <View style={styles.contactContainer}>
              <Ionicons name="mail" size={18} color="#4a5568" />
              <Text style={styles.contactText}>bestworkerrzz@gmail.com</Text>
            </View>
          </SectionWithIcon>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper component for sections with icons
const SectionWithIcon = ({title, iconName, content, children}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={iconName} size={20} color="#2c5282" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {content && <Text style={styles.paragraph}>{content}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5282',
  },
  emptyView: {
    width: 24,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c5282',
    marginLeft: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    color: '#4a5568',
  },
  bulletContainer: {
    marginLeft: 4,
    marginBottom: 15,
  },
  bulletItem: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a5568',
    marginBottom: 6,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 12,
    borderRadius: 8,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#4a5568',
    fontWeight: '500',
  },
});

export default PrivacyPolicyScreen;
