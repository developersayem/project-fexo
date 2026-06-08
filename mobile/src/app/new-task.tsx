import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Tag,
  Check
} from 'lucide-react-native';
import { useTaskStore } from '@/store/useTaskStore';

const CATEGORIES = ['Backend', 'Frontend', 'DevOps', 'Docs', 'Design', 'Testing', 'General'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
const DUE_DATES = ['Today', 'Tomorrow', 'Next Week', 'No Date'];

export default function NewTaskScreen() {
  const router = useRouter();
  const addTask = useTaskStore((state) => state.addTask);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Select category');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [dueDate, setDueDate] = useState('Select date');
  const [estimatedHours, setEstimatedHours] = useState(4);

  // Modal Toggles
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      category: category === 'Select category' ? 'General' : category,
      priority,
      estimatedTime: `${estimatedHours}h`,
      status: 'Pending',
      dueDate: dueDate === 'Select date' ? 'No Date' : dueDate,
    });

    router.back();
  };

  const incrementHours = () => setEstimatedHours((prev) => prev + 1);
  const decrementHours = () => setEstimatedHours((prev) => Math.max(1, prev - 1));

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerIconButton}>
            <ChevronLeft size={24} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>New Task</Text>
          <Pressable onPress={handleSave} style={styles.headerSaveButton}>
            <Text style={styles.headerSaveText}>Save</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Task title..."
              placeholderTextColor="#71717a"
              style={styles.input}
              maxLength={100}
            />
          </View>

          {/* Description Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add description..."
              placeholderTextColor="#71717a"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Category Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Category</Text>
            <Pressable
              onPress={() => setCategoryModalVisible(true)}
              style={styles.selectBox}
            >
              <View style={styles.selectBoxLeft}>
                <Tag size={18} color="#71717a" style={{ marginRight: 10 }} />
                <Text
                  style={[
                    styles.selectBoxText,
                    category === 'Select category' && styles.selectBoxPlaceholderText
                  ]}
                >
                  {category}
                </Text>
              </View>
              <ChevronDown size={18} color="#71717a" />
            </Pressable>
          </View>

          {/* Priority Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => {
                const isSelected = priority === p;
                let activeColor = '#27272a'; // neutral-800
                if (isSelected) {
                  if (p === 'Low') activeColor = '#10b981';
                  if (p === 'Medium') activeColor = '#f97316';
                  if (p === 'High') activeColor = '#ef4444';
                  if (p === 'Critical') activeColor = '#b91c1c';
                }

                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.priorityChip,
                      isSelected
                        ? { backgroundColor: activeColor, borderColor: activeColor }
                        : styles.priorityChipInactive
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityChipText,
                        isSelected && styles.priorityChipTextActive
                      ]}
                    >
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Due Date Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Due Date</Text>
            <Pressable
              onPress={() => setDateModalVisible(true)}
              style={styles.selectBox}
            >
              <View style={styles.selectBoxLeft}>
                <Calendar size={18} color="#71717a" style={{ marginRight: 10 }} />
                <Text
                  style={[
                    styles.selectBoxText,
                    dueDate === 'Select date' && styles.selectBoxPlaceholderText
                  ]}
                >
                  {dueDate}
                </Text>
              </View>
              <ChevronRight size={18} color="#71717a" />
            </Pressable>
          </View>

          {/* Estimated Hours Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Estimated Hours</Text>
            <View style={styles.stepperContainer}>
              <View style={styles.stepperLeft}>
                <Clock size={18} color="#71717a" style={{ marginRight: 10 }} />
                <Text style={styles.stepperValueText}>{estimatedHours} hrs</Text>
              </View>
              <View style={styles.stepperButtons}>
                <Pressable
                  onPress={decrementHours}
                  style={({ pressed }) => [
                    styles.stepperBtn,
                    pressed && styles.stepperBtnPressed
                  ]}
                >
                  <Minus size={16} color="#ffffff" />
                </Pressable>
                <Pressable
                  onPress={incrementHours}
                  style={({ pressed }) => [
                    styles.stepperBtn,
                    pressed && styles.stepperBtnPressed
                  ]}
                >
                  <Plus size={16} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Create Task Gradient Button */}
          <View style={styles.buttonWrapper}>
            <LinearGradient
              colors={['#4f46e5', '#9333ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                  styles.gradientButtonPressable,
                  pressed && styles.buttonPressed
                ]}
              >
                <Plus size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.gradientButtonText}>Create Task</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </ScrollView>

        {/* Category Modal Overlay */}
        <Modal
          visible={categoryModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setCategoryModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => {
                      setCategory(cat);
                      setCategoryModalVisible(false);
                    }}
                    style={styles.modalOption}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextActive
                      ]}
                    >
                      {cat}
                    </Text>
                    {isSelected && <Check size={18} color="#3b82f6" />}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Modal>

        {/* Due Date Modal Overlay */}
        <Modal
          visible={dateModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDateModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setDateModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Due Date</Text>
              {DUE_DATES.map((date) => {
                const isSelected = dueDate === date;
                return (
                  <Pressable
                    key={date}
                    onPress={() => {
                      setDueDate(date);
                      setDateModalVisible(false);
                    }}
                    style={styles.modalOption}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextActive
                      ]}
                    >
                      {date}
                    </Text>
                    {isSelected && <Check size={18} color="#3b82f6" />}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a'
  },
  header: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerSaveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  headerSaveText: {
    color: '#208AEF',
    fontSize: 16,
    fontWeight: '600'
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40
  },
  fieldContainer: {
    flexDirection: 'column',
    gap: 8
  },
  label: {
    color: '#a1a1a1',
    fontSize: 14,
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: 'top'
  },
  selectBox: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectBoxText: {
    color: '#ffffff',
    fontSize: 15
  },
  selectBoxPlaceholderText: {
    color: '#71717a'
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  priorityChipInactive: {
    backgroundColor: '#18181b',
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  priorityChipText: {
    color: '#71717a',
    fontSize: 14,
    fontWeight: '600'
  },
  priorityChipTextActive: {
    color: '#ffffff'
  },
  stepperContainer: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stepperLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepperValueText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500'
  },
  stepperButtons: {
    flexDirection: 'row',
    gap: 12
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepperBtnPressed: {
    backgroundColor: '#3f3f46'
  },
  buttonWrapper: {
    marginTop: 10
  },
  gradientButton: {
    borderRadius: 27,
    overflow: 'hidden'
  },
  gradientButtonPressable: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradientButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonPressed: {
    opacity: 0.85
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    gap: 4
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  modalOptionText: {
    color: '#a1a1a1',
    fontSize: 15
  },
  modalOptionTextActive: {
    color: '#ffffff',
    fontWeight: '500'
  }
});
