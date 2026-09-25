import { Language } from '../context/SettingsContext';

export type TranslationKey =
  | 'manual_entry_success'
  | 'select_employee'
  | 'check_in_time'
  | 'check_out_time'
  | 'attendance_date'
  | 'manual_attendance_entry'
  | 'failed_to_save'
  | 'failed_to_delete'
  | 'saving'
  | 'senior_manager'
  | 'absences'
  | 'absent'
  | 'access_denied'
  | 'access_denied_desc'
  | 'access_policies'
  | 'access_policies_desc'
  | 'access_restricted_admin_hr'
  | 'access_roles'
  | 'accountant'
  | 'action'
  | 'action_taken'
  | 'action_taken_placeholder'
  | 'actions'
  | 'active'
  | 'active_cases'
  | 'active_compliance_alerts_found'
  | 'active_system_users'
  | 'actor'
  | 'add_component'
  | 'add_doctor'
  | 'add_employee'
  | 'add_new'
  | 'add_new_unit'
  | 'add_new_user'
  | 'add_payroll_component'
  | 'add_qualification'
  | 'add_shift_type'
  | 'add_success'
  | 'add_vaccination'
  | 'add_vaccination_subtitle'
  | 'additional_employment_info'
  | 'additional_specialties'
  | 'address'
  | 'adjust_filters'
  | 'admin'
  | 'admin_console'
  | 'admin_only_message'
  | 'admin_subtitle'
  | 'administration'
  | 'agency'
  | 'all'
  | 'all_caught_up'
  | 'all_day'
  | 'all_departments'
  | 'all_documents'
  | 'all_employees_compliant'
  | 'all_entities'
  | 'all_queue'
  | 'all_requests'
  | 'all_rights_reserved'
  | 'all_specialties'
  | 'all_status'
  | 'all_statuses'
  | 'allowance'
  | 'allowances'
  | 'allowances_processed'
  | 'am'
  | 'american'
  | 'annual'
  | 'annual_leave'
  | 'appearance'
  | 'appearance_subtitle'
  | 'approval_history'
  | 'approval_review'
  | 'approvals_inbox'
  | 'approve'
  | 'approve_correction'
  | 'approve_correction_confirm'
  | 'approve_failed'
  | 'approve_request'
  | 'approve_run'
  | 'approve_success'
  | 'approved'
  | 'approved_at'
  | 'approved_by_on'
  | 'approved_by'
  | 'approving'
  | 'arabic'
  | 'archive'
  | 'archived'
  | 'are_you_sure'
  | 'assigned'
  | 'assigned_shift'
  | 'assigned_to'
  | 'assignment_details'
  | 'attachment_hint'
  | 'attachments'
  | 'attendance'
  | 'attendance_imported'
  | 'attendance_imported_success'
  | 'attendance_log'
  | 'attendance_monthly_summary'
  | 'attendance_manual_entry_hint'
  | 'attendance_export_success'
  | 'attendance_mgmt'
  | 'attendance_reminders'
  | 'attendance_subtitle'
  | 'attendance_summary_sent_payroll'
  | 'attendance_trend'
  | 'audit_log'
  | 'audit_log_policy_msg'
  | 'availability'
  | 'availability_status'
  | 'available'
  | 'avg_monthly_net'
  | 'back'
  | 'base_salary'
  | 'basic_details'
  | 'basic_info'
  | 'board_certification'
  | 'bs_nursing'
  | 'bulk_generate'
  | 'bulk_generate_success'
  | 'bulk_generating_msg'
  | 'busy'
  | 'calc_failed'
  | 'calc_method'
  | 'calc_success'
  | 'calculate_payroll'
  | 'calculated'
  | 'calculating'
  | 'cancel'
  | 'cancel_confirm_msg'
  | 'candidates'
  | 'cardiology'
  | 'case_closed_success'
  | 'category'
  | 'cert_training'
  | 'change'
  | 'change_candidate'
  | 'change_password'
  | 'check_in'
  | 'check_in_out'
  | 'check_in_success'
  | 'check_in_success_late'
  | 'check_in_time'
  | 'check_out'
  | 'check_out_success'
  | 'checked_in'
  | 'checked_out'
  | 'checkup_details'
  | 'checkup_scheduled_failed'
  | 'checkup_scheduled_success'
  | 'choose_columns'
  | 'click_to_upload'
  | 'clock_in'
  | 'close'
  | 'close_case'
  | 'closed_date'
  | 'closure_note'
  | 'closure_note_placeholder'
  | 'code'
  | 'collapse_menu'
  | 'comment_placeholder'
  | 'compassionate'
  | 'complete_onboarding'
  | 'completed'
  | 'completed_annual_training'
  | 'compliance_access'
  | 'compliance_alerts'
  | 'compliance_documents'
  | 'compliance_rate'
  | 'compliance_subtitle'
  | 'compliance_training_desc'
  | 'component_added_success'
  | 'component_name'
  | 'components'
  | 'confidential_findings'
  | 'confidential_notes'
  | 'confidential_notes_placeholder'
  | 'configure_policies'
  | 'confirm'
  | 'confirm_cancel'
  | 'confirm_close_case'
  | 'confirm_deactivation'
  | 'confirm_logout'
  | 'confirm_new_password'
  | 'confirm_reject'
  | 'confirm_rejection'
  | 'confirmed'
  | 'conflicts_detected'
  | 'consultation'
  | 'contact_details'
  | 'contact_during_leave'
  | 'contact_information'
  | 'contact_placeholder'
  | 'continue'
  | 'contract'
  | 'contract_agreement'
  | 'contract_information'
  | 'contract_type'
  | 'core_data'
  | 'correction_reason_placeholder'
  | 'correction_request_details'
  | 'correction_requests'
  | 'coverage_analysis'
  | 'create_feb_run'
  | 'create_new_employee'
  | 'create_new_run'
  | 'create_policy'
  | 'create_system_login'
  | 'credentials_documents'
  | 'critical'
  | 'currently_at'
  | 'current_duration'
  | 'current_password'
  | 'current_run_status'
  | 'current_stage'
  | 'current_status'
  | 'current_system_time'
  | 'cv_format_hint'
  | 'dashboard'
  | 'dashboard_subtitle'
  | 'data_management'
  | 'data_management_desc'
  | 'date'
  | 'date_of_birth'
  | 'day'
  | 'day_shift'
  | 'deactivate'
  | 'deactivate_confirm_message'
  | 'deactivate_confirm_question'
  | 'deactivate_doctor'
  | 'deactivate_reason'
  | 'deactivation_started'
  | 'deduction'
  | 'deductions'
  | 'delete'
  | 'department'
  | 'departments'
  | 'dept_distribution'
  | 'dept_head'
  | 'dept_manager_approval'
  | 'dept_placeholder'
  | 'dermatology'
  | 'description'
  | 'description_placeholder'
  | 'details'
  | 'display_columns'
  | 'dob'
  | 'doc'
  | 'doc_national_id'
  | 'doc_preview_placeholder'
  | 'doc_professional_license'
  | 'doctor'
  | 'doctor_code'
  | 'doctor_onboarded'
  | 'doctor_updated'
  | 'doctors'
  | 'doctors_subtitle'
  | 'document_center'
  | 'document_deleted_success'
  | 'document_name'
  | 'document_preview'
  | 'documents'
  | 'dose'
  | 'download'
  | 'download_all'
  | 'download_pdf'
  | 'download_report'
  | 'draft'
  | 'draft_mode'
  | 'draft_saving_soon'
  | 'due_date'
  | 'duration'
  | 'duration_hours'
  | 'edit'
  | 'edit_details'
  | 'edit_doctor'
  | 'edit_permissions'
  | 'education'
  | 'eg_travel_allowance'
  | 'email'
  | 'email_address'
  | 'email_notifications'
  | 'email_notifications_desc'
  | 'email_placeholder'
  | 'emergency'
  | 'emergency_contact'
  | 'emergency_medicine'
  | 'emp_id_placeholder'
  | 'employee'
  | 'employee_added_success'
  | 'employee_data_exported'
  | 'employee_details'
  | 'employee_id'
  | 'employee_name'
  | 'employee_no'
  | 'employee_profile'
  | 'employee_reviews'
  | 'employees'
  | 'employees_subtitle'
  | 'employment_details'
  | 'enable_2fa'
  | 'enable_extra_pay_night'
  | 'enable_extra_pay_weekend'
  | 'enable_pay_on_call'
  | 'end_date'
  | 'end_date_after_start'
  | 'end_date_required'
  | 'english'
  | 'end_time'
  | 'entity_id'
  | 'entity_type'
  | 'error_creating_template'
  | 'error_fetching_analytics'
  | 'error_updating_status'
  | 'eval_cycles'
  | 'eval_templates'
  | 'evening_shift'
  | 'exception_summary'
  | 'exceptions_found'
  | 'exit'
  | 'expand_menu'
  | 'experience_placeholder'
  | 'expired'
  | 'expires_in_days'
  | 'expiring'
  | 'expiring_docs'
  | 'expiring_soon'
  | 'expiring_this_week'
  | 'expiry_date'
  | 'export'
  | 'export_csv'
  | 'export_expiry_list'
  | 'export_history'
  | 'export_org_chart'
  | 'export_pdf'
  | 'export_sheet'
  | 'exposure'
  | 'extreme_values'
  | 'failed'
  | 'failed_fetch_data'
  | 'failed_fetch_history'
  | 'failed_fetch_reviews'
  | 'export_csv'
  | 'export_pdf'
  | 'hours'
  | 'hours_short'
  | 'minutes'
  | 'minutes_short'
  | 'send_to_payroll'
  | 'missing_checkouts'
  | 'feature_coming_soon'
  | 'february_2024'
  | 'feedback_placeholder'
  | 'female'
  | 'field_required'
  | 'file_name'
  | 'filter'
  | 'filter_by_type'
  | 'filter_by_dept'
  | 'apply_filters'
  | 'reset_filters'
  | 'filters_applied_successfully'
  | 'filters'
  | 'finance'
  | 'first_name'
  | 'first_name_placeholder'
  | 'fixed'
  | 'flags'
  | 'follow_up'
  | 'follow_up_completed_success'
  | 'follow_up_details'
  | 'follow_ups'
  | 'forgot_password'
  | 'reset_password_title'
  | 'reset_password_subtitle'
  | 'send_reset_link'
  | 'back_to_login'
  | 'reset_link_sent'
  | 'formula'
  | 'fri'
  | 'full_access'
  | 'full_calendar_view'
  | 'full_name'
  | 'full_name_placeholder'
  | 'full_time'
  | 'future_backend_integration_required'
  | 'gender'
  | 'general_settings'
  | 'general_settings_desc'
  | 'general_surgery'
  | 'generate_report'
  | 'generated_at'
  | 'generated_reports'
  | 'global'
  | 'go_back'
  | 'go_home'
  | 'head_nurse'
  | 'headcount'
  | 'operational_overview'
  | 'system_status'
  | 'active_employees'
  | 'open_positions'
  | 'department_distribution'
  | 'team_status'
  | 'recruitment_funnel'
  | 'on_duty'
  | 'present'
  | 'exceptions'
  | 'no_data'
  | 'health'
  | 'health_certificate'
  | 'health_subtitle'
  | 'high'
  | 'hire_date'
  | 'hospital_anniversary'
  | 'hospital_hierarchy'
  | 'hospital_mgmt_system'
  | 'hr'
  | 'hr_manager'
  | 'hr_manager_only'
  | 'hr_officer'
  | 'hr_view'
  | 'hr_final_approval'
  | 'human_resources'
  | 'id'
  | 'identification'
  | 'illness'
  | 'import_attendance'
  | 'inactive'
  | 'incident_description_placeholder'
  | 'incident_details'
  | 'incident_reported_failed'
  | 'incident_reported_success'
  | 'incidents'
  | 'injury'
  | 'internal_comments'
  | 'internal_medicine'
  | 'interviewers_placeholder'
  | 'interviews'
  | 'invalid_email'
  | 'issue'
  | 'issue_date'
  | 'issuing_authority'
  | 'it'
  | 'job_assignment'
  | 'job_openings'
  | 'job_title_placeholder'
  | 'laboratory'
  | 'language'
  | 'last_name'
  | 'last_name_placeholder'
  | 'last_review'
  | 'late'
  | 'late_min'
  | 'late_penalty_applied'
  | 'late_unpaid'
  | 'latest_payslip_summary'
  | 'leave_balances'
  | 'leave_calendar'
  | 'leave_deductions_applied'
  | 'leave_mgmt'
  | 'leave_overlap'
  | 'leave_request_details'
  | 'leave_reason_placeholder'
  | 'leave_request_approved'
  | 'leave_requests'
  | 'leave_subtitle'
  | 'leave_type'
  | 'leave_type_required'
  | 'leaves'
  | 'license_credentials'
  | 'license_expiry'
  | 'license_name'
  | 'license_number'
  | 'license_placeholder'
  | 'license_status'
  | 'licenses'
  | 'licensing_authority'
  | 'link_candidate'
  | 'link_candidate_desc'
  | 'link_employee'
  | 'link_existing_employee'
  | 'linked_to'
  | 'loading'
  | 'loading_candidates'
  | 'loading_data'
  | 'location'
  | 'location_management'
  | 'location_placeholder'
  | 'lock_failed'
  | 'lock_run'
  | 'locked'
  | 'login_error_empty'
  | 'logout'
  | 'low'
  | 'main_hospital'
  | 'maintenance'
  | 'male'
  | 'manage_data'
  | 'manage_notifications'
  | 'manage_privacy'
  | 'manage_security'
  | 'manage_settings'
  | 'manager'
  | 'manual_entry'
  | 'manual_entry_desc'
  | 'march'
  | 'mark_all_seen'
  | 'mark_as_seen'
  | 'mark_completed'
  | 'mark_renewed'
  | 'marketing_emails'
  | 'marketing_emails_desc'
  | 'maternity'
  | 'max_hours_day'
  | 'max_hours_week'
  | 'max_ot'
  | 'medical'
  | 'medical_checkup'
  | 'medical_checkups'
  | 'medical_license_details'
  | 'medical_license_no'
  | 'medical_license_placeholder'
  | 'medical_license_scan'
  | 'medical_staff'
  | 'medistaff_hr'
  | 'missing_co'
  | 'medium'
  | 'min_staff'
  | 'missing'
  | 'missing_attendance'
  | 'missing_checkout'
  | 'missing_salary'
  | 'mock_address'
  | 'mock_dob'
  | 'mock_emergency_contact_name'
  | 'mock_emergency_contact_relation'
  | 'mock_employee_id'
  | 'mock_hire_date'
  | 'mock_phone'
  | 'mock_supervisor'
  | 'mon'
  | 'month'
  | 'morning_shift'
  | 'ms_nursing'
  | 'multiplier'
  | 'my_attendance_rate'
  | 'my_payslips'
  | 'my_recent_activity'
  | 'my_requests'
  | 'name'
  | 'national_id'
  | 'national_id_ssn'
  | 'nationality'
  | 'nationality_placeholder'
  | 'near_miss'
  | 'negative_net'
  | 'net_payable'
  | 'net_payroll'
  | 'net_salary'
  | 'neurology'
  | 'new_custom_report'
  | 'new_document_optional'
  | 'new_expiry_date'
  | 'new_leave_request'
  | 'new_password'
  | 'new_request'
  | 'next'
  | 'next_checkup_date'
  | 'next_review'
  | 'next_shift'
  | 'next_step_payroll_review'
  | 'night_shift'
  | 'night_shift_allowance'
  | 'no_actions_recorded'
  | 'no_active_payroll_run'
  | 'no_alerts_found'
  | 'no_expiring_docs'
  | 'no_recent_hires'
  | 'no_one_on_leave'
  | 'no_attachments_provided'
  | 'no_attachments_provided'
  | 'no_candidates_found'
  | 'no_compliance_alerts'
  | 'no_data_available'
  | 'no_eligible_employees'
  | 'no_keep_editing'
  | 'no_recent_activity'
  | 'no_records_found'
  | 'no_shift_scheduled'
  | 'no_swap_requests'
  | 'not_available'
  | 'note'
  | 'notes'
  | 'notes_placeholder'
  | 'notifications'
  | 'notifications_desc'
  | 'notifications_subtitle'
  | 'number'
  | 'nurse'
  | 'nursing'
  | 'nursing_license'
  | 'occupational_health'
  | 'of'
  | 'off'
  | 'offers'
  | 'oho'
  | 'oho_only'
  | 'ok'
  | 'on'
  | 'on_call'
  | 'on_call_allowance'
  | 'on_call_status'
  | 'on_leave'
  | 'on_leave_today'
  | 'onboard_doctor'
  | 'onboarding_path'
  | 'onboarding_path_desc'
  | 'once_locked_review'
  | 'open_fullscreen'
  | 'operations'
  | 'optional'
  | 'org_chart_engine_offline'
  | 'org_chart_engine_offline_desc'
  | 'org_chart_placeholder'
  | 'org_chart_placeholder_desc'
  | 'org_structure'
  | 'organization'
  | 'orthopedics'
  | 'oryxstaff'
  | 'other'
  | 'other_document'
  | 'overall_coverage'
  | 'overall_rating'
  | 'overtime'
  | 'overtime_allowed'
  | 'overtime_calculated'
  | 'overtime_late_summary'
  | 'overview'
  | 'passport_expiry'
  | 'passport_number'
  | 'password'
  | 'password_recovery_demo'
  | 'password_too_short'
  | 'passwords_dont_match'
  | 'paternity'
  | 'patient'
  | 'patient_no'
  | 'payroll'
  | 'payroll_history'
  | 'payroll_history_desc'
  | 'payroll_history_subtitle'
  | 'payroll_mgmt'
  | 'payroll_officer'
  | 'payroll_report'
  | 'payroll_review'
  | 'payroll_review_subtitle'
  | 'payroll_settings'
  | 'payroll_settings_subtitle'
  | 'payroll_status'
  | 'payroll_subtitle'
  | 'payroll_summary'
  | 'payslip'
  | 'payslip_available'
  | 'payslip_download_success'
  | 'payslips'
  | 'payslips_subtitle'
  | 'pediatrics'
  | 'peer'
  | 'pending'
  | 'pending_checkups'
  | 'pending_followups'
  | 'pending_leaves'
  | 'pending_queue'
  | 'pending_requests'
  | 'pending_review'
  | 'pending_verification'
  | 'people'
  | 'percentage'
  | 'performance'
  | 'performance_active_participants'
  | 'performance_all_employees'
  | 'performance_all_fields_required'
  | 'performance_analytics_subtitle'
  | 'performance_analytics_title'
  | 'performance_assign_evaluators'
  | 'performance_assign_evaluators_desc'
  | 'performance_avg_org_score'
  | 'performance_communication'
  | 'performance_competency_ratings'
  | 'performance_complete_review'
  | 'performance_completion'
  | 'performance_completion_rate'
  | 'performance_create_new_template'
  | 'performance_create_template'
  | 'performance_created_at'
  | 'performance_created_by'
  | 'performance_cycle_active'
  | 'performance_cycle_closed'
  | 'performance_cycle_created'
  | 'performance_cycle_finalized'
  | 'performance_cycle_name'
  | 'performance_cycle_note'
  | 'performance_cycle_placeholder'
  | 'performance_cycle_progress'
  | 'performance_cycle_status_updated'
  | 'performance_cycles_subtitle'
  | 'performance_cycles_title'
  | 'performance_dept_averages'
  | 'performance_development_plan'
  | 'performance_discipline'
  | 'performance_draft_saved'
  | 'performance_draft_saved_success'
  | 'performance_due_date'
  | 'performance_edit_template'
  | 'performance_employee'
  | 'performance_evaluator'
  | 'performance_evaluator_name'
  | 'performance_failed_load_reviews'
  | 'performance_failed_submit'
  | 'performance_failed_submit_review'
  | 'performance_final_assessment'
  | 'performance_finalize_confirmation_text'
  | 'performance_finalize_results'
  | 'performance_fixed_sections'
  | 'performance_manager_comments'
  | 'performance_mgmt'
  | 'performance_my_pending_reviews'
  | 'performance_my_received_reviews'
  | 'performance_overall_score'
  | 'performance_period'
  | 'performance_period_type'
  | 'performance_rating_placeholder'
  | 'performance_review_details'
  | 'performance_review_submitted'
  | 'performance_reviews_subtitle'
  | 'performance_reviews_title'
  | 'performance_save_assignments'
  | 'performance_save_draft'
  | 'performance_scope'
  | 'performance_score_distribution'
  | 'performance_specific_dept'
  | 'performance_start_cycle'
  | 'performance_start_new_cycle'
  | 'performance_submit_confirmation_text'
  | 'performance_submit_review'
  | 'performance_subtitle'
  | 'performance_summary'
  | 'performance_teamwork'
  | 'performance_technical_skills'
  | 'performance_template'
  | 'performance_template_archived'
  | 'performance_template_created'
  | 'performance_template_name'
  | 'performance_template_name_required'
  | 'performance_template_placeholder'
  | 'performance_template_published'
  | 'performance_template_status_updated'
  | 'performance_templates_subtitle'
  | 'performance_templates_title'
  | 'performance_timeline'
  | 'performance_top_performers'
  | 'performance_top_rated_employees'
  | 'performance_update_template'
  | 'performance_version'
  | 'period'
  | 'periodic'
  | 'personal_details'
  | 'personal_information'
  | 'pharmacy'
  | 'phone'
  | 'phone_number'
  | 'phone_placeholder'
  | 'physician'
  | 'physician_placeholder'
  | 'please_wait'
  | 'pm'
  | 'policies'
  | 'policy_violation'
  | 'position'
  | 'position_placeholder'
  | 'positions'
  | 'pre_employment'
  | 'previous'
  | 'primary_gradient'
  | 'primary_role'
  | 'primary_specialty'
  | 'primary_specialty_desc'
  | 'print'
  | 'privacy_gdpr'
  | 'privacy_gdpr_desc'
  | 'probation_end'
  | 'probation_period'
  | 'process_payroll'
  | 'processed_queue'
  | 'prof_licenses'
  | 'professional_summary'
  | 'profile'
  | 'profile_settings_subtitle'
  | 'profile_subtitle'
  | 'provide_closure_note'
  | 'provide_expiry_date'
  | 'provide_rejection_reason'
  | 'provider'
  | 'provider_placeholder'
  | 'publish'
  | 'publish_schedule'
  | 'published'
  | 'push_notifications'
  | 'push_notifications_desc'
  | 'qualification'
  | 'qualification_details'
  | 'quarterly'
  | 'quick_assign'
  | 'quick_links'
  | 'radiology'
  | 'read_only_view'
  | 'reason'
  | 'reason_closing_placeholder'
  | 'reason_for_correction'
  | 'reason_placeholder'
  | 'reason_rejection_placeholder'
  | 'reason_required'
  | 'recent_activity'
  | 'recently_deleted'
  | 'recommendations'
  | 'recruitment'
  | 'recruitment_about_to_create_employee'
  | 'recruitment_actions'
  | 'recruitment_add_candidate'
  | 'recruitment_all_departments'
  | 'recruitment_all_statuses'
  | 'recruitment_allowances'
  | 'recruitment_accepted'
  | 'recruitment_applied'
  | 'recruitment_approved'
  | 'recruitment_approve'
  | 'recruitment_approve_offer'
  | 'recruitment_assign_employee_dept'
  | 'recruitment_back'
  | 'recruitment_base_salary'
  | 'recruitment_cancel'
  | 'recruitment_cancel_confirmation_text'
  | 'recruitment_cancel_interview'
  | 'recruitment_cancelled'
  | 'recruitment_candidate'
  | 'recruitment_candidate_added_success'
  | 'recruitment_candidate_details'
  | 'recruitment_candidate_editing_soon'
  | 'recruitment_candidate_hired_success'
  | 'recruitment_candidate_moved_interview'
  | 'recruitment_candidate_moved_offer'
  | 'recruitment_candidate_moved_to'
  | 'recruitment_candidate_pipeline'
  | 'recruitment_candidate_profile'
  | 'recruitment_candidate_rejected_success'
  | 'recruitment_candidates'
  | 'recruitment_close_job_opening'
  | 'recruitment_close_job_opening_msg'
  | 'recruitment_close_opening'
  | 'recruitment_close_opening_msg'
  | 'recruitment_closed'
  | 'recruitment_confirm_close'
  | 'recruitment_confirm_data'
  | 'recruitment_confirm_decline'
  | 'recruitment_confirm_reject'
  | 'recruitment_confirm_reject_btn'
  | 'recruitment_contract'
  | 'recruitment_contract_type'
  | 'recruitment_convert_candidate'
  | 'recruitment_convert_to_employee'
  | 'recruitment_convert_wizard_title'
  | 'recruitment_create_opening'
  | 'recruitment_created_at'
  | 'recruitment_date'
  | 'recruitment_date_time'
  | 'recruitment_decline_reason'
  | 'recruitment_decline_reason_desc'
  | 'recruitment_decline_reason_placeholder'
  | 'recruitment_decline_reason_prompt'
  | 'recruitment_department'
  | 'recruitment_draft'
  | 'recruitment_education_not_specified'
  | 'recruitment_email'
  | 'recruitment_entry'
  | 'recruitment_experience'
  | 'recruitment_experience_level'
  | 'recruitment_fail'
  | 'recruitment_failed_action'
  | 'recruitment_failed_add'
  | 'recruitment_failed_decline'
  | 'recruitment_failed_generate'
  | 'recruitment_failed_generate_offer'
  | 'recruitment_failed_load_interviews'
  | 'recruitment_failed_load_offers'
  | 'recruitment_failed_load_openings'
  | 'recruitment_failed_load_pipeline'
  | 'recruitment_failed_move'
  | 'recruitment_failed_record'
  | 'recruitment_failed_reject'
  | 'recruitment_failed_schedule'
  | 'recruitment_final'
  | 'recruitment_finalize'
  | 'recruitment_finalize_create'
  | 'recruitment_full_name'
  | 'recruitment_full_time'
  | 'recruitment_generate_draft'
  | 'recruitment_generate_offer'
  | 'recruitment_hire_date'
  | 'recruitment_hired'
  | 'recruitment_hiring_manager'
  | 'recruitment_hr'
  | 'recruitment_internship'
  | 'recruitment_interview'
  | 'recruitment_interview_cancelled_success'
  | 'recruitment_interview_editing_soon'
  | 'recruitment_interview_scheduled'
  | 'recruitment_interview_type'
  | 'recruitment_interviewer'
  | 'recruitment_interviewers'
  | 'recruitment_interviews'
  | 'recruitment_invalid_selection'
  | 'recruitment_job_assignment'
  | 'recruitment_job_description'
  | 'recruitment_job_description_placeholder'
  | 'recruitment_job_details'
  | 'recruitment_job_opening'
  | 'recruitment_job_openings'
  | 'recruitment_job_title'
  | 'recruitment_lead'
  | 'recruitment_location_link'
  | 'recruitment_mark_accepted'
  | 'recruitment_mark_as_declined'
  | 'recruitment_mark_declined'
  | 'recruitment_mid'
  | 'recruitment_nationality'
  | 'recruitment_new_candidate'
  | 'recruitment_new_job_opening'
  | 'recruitment_next'
  | 'recruitment_no_candidates'
  | 'recruitment_no_permission_action'
  | 'recruitment_no_permission_add'
  | 'recruitment_no_permission_generate'
  | 'recruitment_no_permission_generate_offer'
  | 'recruitment_no_permission_move'
  | 'recruitment_no_permission_record'
  | 'recruitment_no_permission_schedule'
  | 'recruitment_notes'
  | 'recruitment_offer'
  | 'recruitment_offer_accepted'
  | 'recruitment_offer_approved'
  | 'recruitment_offer_declined_success'
  | 'recruitment_offer_details'
  | 'recruitment_offer_generated'
  | 'recruitment_offer_sent'
  | 'recruitment_offers'
  | 'recruitment_open'
  | 'recruitment_opening_approved'
  | 'recruitment_opening_closed'
  | 'recruitment_opening_created_draft'
  | 'recruitment_opening_rejected'
  | 'recruitment_opening_submitted'
  | 'recruitment_outcome'
  | 'recruitment_panel'
  | 'recruitment_part_time'
  | 'recruitment_pass'
  | 'recruitment_passed'
  | 'recruitment_pending'
  | 'recruitment_pending_approval'
  | 'recruitment_permissions'
  | 'recruitment_phone'
  | 'recruitment_position'
  | 'recruitment_position_type'
  | 'recruitment_primary_role'
  | 'recruitment_priority'
  | 'recruitment_priority_high'
  | 'recruitment_priority_low'
  | 'recruitment_priority_medium'
  | 'recruitment_proposed_start_date'
  | 'recruitment_provide_reason'
  | 'recruitment_provide_reason_error'
  | 'recruitment_provide_rejection_reason'
  | 'recruitment_ready_finalize'
  | 'recruitment_reason_closing_placeholder'
  | 'recruitment_reason_rejection_placeholder'
  | 'recruitment_record_outcome'
  | 'recruitment_record_result'
  | 'recruitment_reject'
  | 'recruitment_reject_candidate'
  | 'recruitment_reject_job_opening'
  | 'recruitment_reject_opening_msg'
  | 'recruitment_rejected'
  | 'recruitment_rejection_reason_msg'
  | 'recruitment_rejection_reason_placeholder'
  | 'recruitment_requirements'
  | 'recruitment_requirements_placeholder'
  | 'recruitment_result_recorded'
  | 'recruitment_resume_cv'
  | 'recruitment_review_confirm_data'
  | 'recruitment_roles_access'
  | 'recruitment_salary'
  | 'recruitment_save'
  | 'recruitment_save_result'
  | 'recruitment_schedule'
  | 'recruitment_schedule_interview'
  | 'recruitment_scheduled'
  | 'recruitment_score'
  | 'recruitment_screening'
  | 'recruitment_search_placeholder'
  | 'recruitment_select_outcome_error'
  | 'recruitment_send_offer'
  | 'recruitment_senior'
  | 'recruitment_sent'
  | 'recruitment_setup_access_roles'
  | 'recruitment_source'
  | 'recruitment_start_date'
  | 'recruitment_status'
  | 'recruitment_step_confirm_data'
  | 'recruitment_step_finalize'
  | 'recruitment_step_job_assignment'
  | 'recruitment_step_roles_access'
  | 'recruitment_submit_approval'
  | 'recruitment_submit_for_approval'
  | 'recruitment_subtitle'
  | 'recruitment_supervisor'
  | 'recruitment_technical'
  | 'recruitment_time'
  | 'recruitment_vacancies'
  | 'recruitment_view_details'
  | 'recruitment_view_pipeline'
  | 'recruitment_withdrawn'
  | 'referral'
  | 'refresh_data'
  | 'reject'
  | 'reject_correction_hint'
  | 'reject_correction_request'
  | 'reject_verification'
  | 'reject_request'
  | 'rejected'
  | 'rejection_failed'
  | 'rejection_reason_placeholder'
  | 'rejection_reason'
  | 'currently_at'
  | 'days'
  | 'dept_manager_approval'
  | 'hr_final_approval'
  | 'leave_request_details'
  | 'my_requests'
  | 'new_leave_request'
  | 'pending_review'
  | 'rejected_at_stage'
  | 'request_details'
  | 'search_leave_placeholder'
  | 'stage_status'
  | 'team_requests'
  | 'all_requests'
  | 'approval_history'
  | 'approved_by_on'
  | 'scheduling_block_hint'
  | 'rejection_reason_desc'
  | 'rejection_success'
  | 'active_system_users'
  | 'admin_console'
  | 'admin_subtitle'
  | 'audit_log'
  | 'branding_settings'
  | 'edit_unit'
  | 'edit_user'
  | 'localization_settings'
  | 'notification_settings'
  | 'org_management'
  | 'privacy_settings'
  | 'role_permissions'
  | 'rbac_active_desc'
  | 'role_scope'
  | 'access_level'
  | 'organization_scope'
  | 'department_scope'
  | 'own_records'
  | 'modules_count'
  | 'save_settings_success'
  | 'security_settings'
  | 'system_configuration'
  | 'unit_created_success'
  | 'unit_details'
  | 'user_created_success'
  | 'user_details'
  | 'user_management'
  | 'users'
  | 'user'
  | 'january_2024'
  | 'february_2024'
  | 'march_2024'
  | 'system_admin'
  | 'hr_manager'
  | 'hr_officer'
  | 'dept_head'
  | 'occ_health_officer'
  | 'it_dept'
  | 'hr_dept'
  | 'clinical_dept'
  | 'access_policies_desc'
  | 'hospital_name'
  | 'hospital_name_label'
  | 'logo_label'
  | 'upload_logo'
  | 'language_label'
  | 'timezone_label'
  | 'english'
  | 'arabic'
  | 'gulf_standard_time'
  | 'arabian_standard_time'
  | 'security_level'
  | 'strong'
  | 'medium'
  | 'email_notifications'
  | 'sms_alerts'
  | 'push_notifications'
  | 'gdpr_compliance'
  | 'gdpr_compliance_desc'
  | 'data_retention'
  | 'main_campus'
  | 'west_wing'
  | 'east_wing'
  | 'outpatient_clinic'
  | 'research_center'
  | 'level_department'
  | 'level_unit'
  | 'level_section'
  | 'top_level'
  | 'action_create'
  | 'action_update'
  | 'action_delete'
  | 'action_login'
  | 'action_logout'
  | 'ip_address'
  | 'user_agent'
  | 'remaining_leaves'
  | 'remember_me'
  | 'reminder_checkout'
  | 'reminder_late'
  | 'reminder_missing'
  | 'reminder_policy'
  | 'renew_license'
  | 'renew_license_desc'
  | 'renew_qualification'
  | 'renew_success'
  | 'replacement_employee'
  | 'report'
  | 'report_builder'
  | 'report_catalog'
  | 'report_download_success'
  | 'report_history'
  | 'report_incident'
  | 'report_incident_subtitle'
  | 'reported_by'
  | 'reports'
  | 'reports_adjust_filters'
  | 'reports_all_categories'
  | 'reports_all_departments'
  | 'reports_all_statuses'
  | 'reports_compile_data_note'
  | 'reports_compliance'
  | 'reports_configure_custom'
  | 'reports_customizing'
  | 'reports_data_preview'
  | 'reports_download_excel'
  | 'reports_download_pdf'
  | 'reports_employee_optional'
  | 'reports_executive'
  | 'reports_filters_applied'
  | 'reports_attendance_report_desc'
  | 'reports_attendance_report_name'
  | 'reports_budget_utilization_desc'
  | 'reports_budget_utilization_name'
  | 'reports_compliance_audit_desc'
  | 'reports_compliance_audit_name'
  | 'reports_executive_summary_desc'
  | 'reports_executive_summary_name'
  | 'reports_financial'
  | 'reports_format'
  | 'reports_generate_full'
  | 'reports_generated_at'
  | 'reports_generated_by'
  | 'reports_generated_success'
  | 'reports_generating'
  | 'reports_id'
  | 'reports_id_label'
  | 'reports_immutable_note_text'
  | 'reports_immutable_note_title'
  | 'reports_metadata'
  | 'reports_mock_data_note'
  | 'reports_name'
  | 'reports_no_reports_found'
  | 'reports_open_in_builder'
  | 'reports_operational'
  | 'reports_payroll_variance_desc'
  | 'reports_payroll_variance_name'
  | 'reports_period'
  | 'reports_ready_for_download'
  | 'reports_ready_to_generate'
  | 'reports_recruitment_funnel_desc'
  | 'reports_recruitment_funnel_name'
  | 'reports_scope_dept'
  | 'reports_search_employee_placeholder'
  | 'reports_search_placeholder'
  | 'reports_standardized_templates'
  | 'reports_step_filters'
  | 'reports_step_generate'
  | 'reports_step_preview'
  | 'reports_step_type'
  | 'reports_subtitle'
  | 'reports_value'
  | 'reports_workforce'
  | 'request_admin_access'
  | 'request_for'
  | 'request_leave'
  | 'request_type'
  | 'requested_in'
  | 'requested_out'
  | 'requester'
  | 'required'
  | 'required_documents'
  | 'requirements_placeholder'
  | 'results'
  | 'results_analytics'
  | 'results_summary'
  | 'return_to_work'
  | 'returns_monday'
  | 'role'
  | 'role_definitions'
  | 'roster_summary'
  | 'rule_name'
  | 'rules_rates'
  | 'run_checklist'
  | 'run_create_failed'
  | 'run_created_success'
  | 'run_locked'
  | 'run_locked_success'
  | 'run_payroll_subtitle'
  | 'run_unlocked'
  | 'run_unlocked_success'
  | 'sat'
  | 'save'
  | 'save_changes'
  | 'save_component'
  | 'save_draft'
  | 'save_settings'
  | 'schedule'
  | 'schedule_checkup'
  | 'schedule_checkup_subtitle'
  | 'scheduling'
  | 'scheduling_block_hint'
  | 'scheduling_subtitle'
  | 'scheduling_title'
  | 'scope'
  | 'scheduling_access'
  | 'search'
  | 'search_approvals_placeholder'
  | 'search_attendance_placeholder'
  | 'search_candidate'
  | 'search_candidate_placeholder'
  | 'search_checkups'
  | 'search_components'
  | 'search_docs_placeholder'
  | 'search_employee'
  | 'search_employee_dept'
  | 'search_employee_placeholder'
  | 'search_follow_ups'
  | 'search_incidents'
  | 'search_logs_placeholder'
  | 'search_org_placeholder'
  | 'search_period'
  | 'search_period_approver'
  | 'search_placeholder'
  | 'search_placeholder_employees'
  | 'search_placeholder_generic'
  | 'search_qualifications_placeholder'
  | 'search_to_begin'
  | 'search_users_placeholder'
  | 'search_vaccinations'
  | 'security'
  | 'security_alerts'
  | 'security_alerts_desc'
  | 'security_auth'
  | 'security_auth_desc'
  | 'security_subtitle'
  | 'security_tab'
  | 'select_candidate'
  | 'select_department'
  | 'select_job_opening'
  | 'select_language'
  | 'select_leave_type'
  | 'select_period_create_run'
  | 'select_primary_specialty'
  | 'select_replacement'
  | 'select_role_demo'
  | 'select_theme'
  | 'selected_candidate'
  | 'settings'
  | 'settings_saved_success'
  | 'settings_subtitle'
  | 'severity'
  | 'severity_critical'
  | 'severity_high'
  | 'severity_low'
  | 'severity_medium'
  | 'shift_configurations'
  | 'shift_name'
  | 'shift_code'
  | 'shift_types'
  | 'shifts_calendar'
  | 'showing_exceptions'
  | 'showing_results'
  | 'sick'
  | 'sign_in'
  | 'sign_in_subtitle'
  | 'specialization_certificate'
  | 'specialties'
  | 'specialty_mapping'
  | 'stage'
  | 'stage_history'
  | 'start_date'
  | 'start_date_required'
  | 'start_time'
  | 'state_medical_college'
  | 'status'
  | 'status_closed'
  | 'status_completed'
  | 'status_due'
  | 'status_followup_required'
  | 'status_open'
  | 'status_overdue'
  | 'status_partially_completed'
  | 'status_pending'
  | 'status_pending_results'
  | 'status_resolved'
  | 'status_scheduled'
  | 'status_under_investigation'
  | 'submission_date'
  | 'submitted_at'
  | 'submit'
  | 'submit_correction_request'
  | 'submit_request'
  | 'summary'
  | 'summary_access'
  | 'sun'
  | 'supervisor'
  | 'surgery_prep'
  | 'swap_requests'
  | 'swap_requests_desc'
  | 'system_admin'
  | 'system_login_desc'
  | 'system_settings'
  | 'system_settings_read_only_msg'
  | 'system_status_healthy'
  | 'tab_loading_desc'
  | 'tags'
  | 'talent'
  | 'task'
  | 'tax_rules'
  | 'tax_social_security'
  | 'team_meeting'
  | 'technician'
  | 'template'
  | 'terminate'
  | 'terminate_confirm_msg'
  | 'terminate_employee'
  | 'termination_initiated'
  | 'theme'
  | 'theme_berry'
  | 'theme_forest'
  | 'theme_indigo'
  | 'theme_medical'
  | 'theme_royal'
  | 'theme_sky'
  | 'theme_sunset'
  | 'theme_teal'
  | 'thu'
  | 'time_range'
  | 'timestamp'
  | 'to'
  | 'today'
  | 'todays_schedule'
  | 'tomorrow'
  | 'total_allowances'
  | 'total_base'
  | 'total_deductions'
  | 'total_documents'
  | 'total_employees'
  | 'total_files'
  | 'total_hours'
  | 'total_worked'
  | 'total_net'
  | 'total_paid_ytd'
  | 'total_runs'
  | 'training_certificate'
  | 'trend_action_required'
  | 'trend_high_priority'
  | 'trend_month'
  | 'trend_pre_employment'
  | 'trend_stable'
  | 'trend_week'
  | 'tue'
  | 'two_factor_auth'
  | 'two_factor_subtitle'
  | 'type'
  | 'types_policies'
  | 'annual_entitlement'
  | 'max_carry_over'
  | 'min_notice_days'
  | 'requires_attachment'
  | 'is_paid'
  | 'leave_type'
  | 'update_policy'
  | 'policy_updated_success'
  | 'understaffed'
  | 'understaffed_shifts'
  | 'unit'
  | 'units'
  | 'university_healthcare'
  | 'unlock_failed'
  | 'unlock_run'
  | 'manage_leave_rules'
  | 'attachment_policy_desc'
  | 'payment_policy_desc'
  | 'paid'
  | 'unpaid'
  | 'unpaid_leave_detected'
  | 'unsaved_changes'
  | 'upcoming_appointments'
  | 'upcoming_events'
  | 'update_qualification'
  | 'update_status'
  | 'upload'
  | 'upload_attachment'
  | 'upload_credentials'
  | 'upload_credentials_desc'
  | 'upload_cv_hint'
  | 'upload_date'
  | 'upload_document'
  | 'upload_file'
  | 'upload_success'
  | 'upload_documents'
  | 'upload_documents_desc'
  | 'uploading'
  | 'uploaded_by'
  | 'applied_date'
  | 'attendance_management'
  | 'convert_to_employee'
  | 'curriculum_vitae'
  | 'department_head'
  | 'experience'
  | 'experience_years'
  | 'is_overnight'
  | 'generate_offer'
  | 'job_opening'
  | 'legacy_attachment'
  | 'no_documents_attached'
  | 'resume_cv'
  | 'schedule_interview'
  | 'scheduling_access'
  | 'select_position'
  | 'select_supervisor'
  | 'select_type'
  | 'self_service_portal'
  | 'source'
  | 'stage_history'
  | 'uploaded_documents'
  | 'urgent_alerts'
  | 'user_list_unavailable'
  | 'user_list_unavailable_desc'
  | 'user_management_placeholder'
  | 'user_management_placeholder_desc'
  | 'username_or_email'
  | 'users_access'
  | 'v2_optional_toggles'
  | 'vaccination'
  | 'vaccination_added_failed'
  | 'vaccination_added_success'
  | 'vaccination_coverage'
  | 'vaccination_details'
  | 'vaccinations'
  | 'vaccine_name'
  | 'vaccine_placeholder'
  | 'valid'
  | 'value'
  | 'verification'
  | 'verification_failed'
  | 'verification_queue'
  | 'verification_review'
  | 'verification_success'
  | 'verify'
  | 'version'
  | 'view'
  | 'view_profile'
  | 'quick_actions'
  | 'system_health'
  | 'active_users'
  | 'payroll_cycle'
  | 'cutoff_date'
  | 'calculation_progress'
  | 'my_department'
  | 'staffing_levels'
  | 'workforce_health'
  | 'compliance_status'
  | 'audit_logs'
  | 'view_payslip'
  | 'system_uptime'
  | 'user_activity_trend'
  | 'recent_hires'
  | 'view_all'
  | 'dept_attendance'
  | 'approve_leaves'
  | 'failed_login_attempts'
  | 'view_details'
  | 'view_draft_sheet'
  | 'view_exceptions'
  | 'view_exceptions_only'
  | 'view_schedule'
  | 'visual_org_chart'
  | 'vs_last_month'
  | 'wed'
  | 'week'
  | 'weekend_allowance'
  | 'weekly_schedule_preview'
  | 'welcome_back'
  | 'wizard_subtitle'
  | 'work_information'
  | 'work_location'
  | 'workforce_management'
  | 'working_hours_policies'
  | 'years'
  | 'audit_log_details'
  | 'activity_details'
  | 'showing'
  | 'of'
  | 'entries'
  | 'close'
  | 'filters'
  | 'entity'
  | 'unit_name'
  | 'manager'
  | 'employees'
  | 'parent_unit'
  | 'create_unit'
  | 'hospital_hierarchy'
  | 'location_management'
  | 'unit_management'
  | 'select_role'
  | 'create_user'
  | 'manage_roles'
  | 'org_chart_placeholder_desc'
  | 'audit_log_placeholder_desc'
  | 'audit_policy'
  | 'hospital_name'
  | 'system_logo'
  | 'upload_new'
  | 'default_language'
  | 'timezone'
  | 'password_policy'
  | 'session_timeout'
  | 'team_status_today'
  | 'clocked_in'
  | 'pending_team_approvals'
  | 'no_pending_approvals'
  | 'view_all_approvals'
  | 'yes_cancel';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    senior_manager: 'Senior Manager',
    team_status_today: 'Team Status Today',
    clocked_in: 'Clocked In',
    pending_team_approvals: 'Pending Team Approvals',
    no_pending_approvals: 'No pending approvals for your team.',
    view_all_approvals: 'View All Approvals',
    hospital_name: 'Hospital Name',
    system_logo: 'System Logo',
    upload_new: 'Upload New',
    default_language: 'Default Language',
    timezone: 'Timezone',
    password_policy: 'Password Policy',
    session_timeout: 'Session Timeout',
    audit_log_details: 'Audit Log Details',
    activity_details: 'Activity Details',
    showing: 'Showing',
    of: 'of',
    entries: 'entries',
    close: 'Close',
    filters: 'Filters',
    entity: 'Entity',
    unit_name: 'Unit Name',
    manager: 'Manager',
    employees: 'Employees',
    parent_unit: 'Parent Unit',
    create_unit: 'Create Unit',
    hospital_hierarchy: 'Hospital Hierarchy',
    location_management: 'Location Management',
    unit_management: 'Unit Management',
    select_role: 'Select Role',
    create_user: 'Create User',
    manage_roles: 'Manage Roles',
    configure_policies: 'Configure Policies',
    org_chart_placeholder_desc: 'Manage departments, units, and hospital hierarchy. Define reporting lines and organizational structure.',
    audit_log_placeholder_desc: 'System activity is logged for security and compliance. Logs are retained for 365 days according to hospital policy.',
    audit_policy: 'Audit & Retention Policy',
    manual_entry_success: 'Attendance record created successfully.',
    select_employee: 'Select Employee',
    check_in_time: 'Check-in Time',
    check_out_time: 'Check-out Time',
    attendance_date: 'Attendance Date',
    manual_attendance_entry: 'Manual Attendance Entry',
    failed_to_save: 'Failed to save record.',
    failed_to_delete: 'Failed to delete item',
    saving: 'Saving...',
    absences: 'Absences',
    absent: 'Absent',
    access_denied: 'Access Denied',
    access_denied_desc: 'You do not have permission to access this page.',
    access_policies: 'Access Policies',
    access_policies_desc: 'Define IP whitelisting, device management, and conditional access policies.',
    access_restricted_admin_hr: 'Access restricted to System Administrators and HR Managers',
    access_roles: 'Access & Roles',
    accountant: 'Accountant',
    action: 'Action',
    action_taken: 'Action Taken',
    action_taken_placeholder: 'Immediate actions taken...',
    actions: 'Actions',
    active: 'Active',
    active_cases: 'Active Cases',
    active_compliance_alerts_found: 'active compliance alerts found requiring attention.',
    active_system_users: 'Active System Users',
    actor: 'Actor',
    add_component: 'Add Component',
    add_doctor: 'Add Doctor',
    add_employee: 'Add Employee',
    add_new: 'Add New',
    add_new_unit: 'Add New Unit',
    admin_console: 'Administration Console',
    admin_subtitle: 'Configure system-wide settings, manage user access, define organizational hierarchy, and monitor system activity.',
    audit_log: 'Audit & Activity Log',
    branding_settings: 'Branding Settings',
    edit_unit: 'Edit Unit',
    edit_user: 'Edit User',
    localization_settings: 'Localization Settings',
    notification_settings: 'Notification Settings',
    org_management: 'Organization Management',
    privacy_settings: 'Privacy Settings',
    role_permissions: 'Role Permissions',
    rbac_active_desc: 'Role-based access is active. Screens and actions are filtered by role and data scope.',
    role_scope: 'Data scope',
    access_level: 'Access level',
    organization_scope: 'Organization-wide',
    department_scope: 'Own department',
    own_records: 'Own records only',
    modules_count: 'modules',
    save_settings_success: 'Settings saved successfully',
    security_settings: 'Security Settings',
    system_configuration: 'System Configuration',
    unit_created_success: 'Unit created successfully',
    unit_details: 'Unit Details',
    user_created_success: 'User created successfully',
    user_details: 'User Details',
    user_management: 'User Management',
    users: 'Users',
    user: 'User',
    january_2024: 'January 2024',
    february_2024: 'February 2024',
    march_2024: 'March 2024',
    system_admin: 'System Admin',
    hr_manager: 'HR Manager',
    hr_officer: 'HR Officer',
    dept_head: 'Department Head',
    occ_health_officer: 'Occupational Health Officer',
    it_dept: 'IT',
    hr_dept: 'Human Resources',
    clinical_dept: 'Clinical Services',
    inactive: 'Inactive',
    pending: 'Pending',
    add_new_user: 'Add New User',
    add_payroll_component: 'Add Payroll Component',
    add_qualification: 'Add {type}',
    add_shift_type: 'Add Shift Type',
    add_success: 'Added successfully',
    add_vaccination: 'Add Vaccination',
    add_vaccination_subtitle: 'Record a vaccination or immunization dose for an employee.',
    additional_employment_info: 'Additional employment history and contract documents are available in the documents tab.',
    additional_specialties: 'Additional Specialties',
    address: 'Address',
    adjust_filters: 'Try adjusting your filters or search terms to find what you are looking for.',
    admin: 'Administration',
    admin_only_message: 'This section is available for System Administrators only.',
    administration: 'Administration',
    agency: 'Agency',
    all: 'All',
    all_caught_up: 'All caught up!',
    all_day: 'All Day',
    all_departments: 'All Departments',
    all_documents: 'All Documents',
    all_employees_compliant: 'All employees are currently compliant with health requirements.',
    all_entities: 'All Entities',
    all_queue: 'All Queue',
    all_rights_reserved: 'All rights reserved.',
    all_specialties: 'All Specialties',
    all_status: 'All Status',
    all_statuses: 'All Statuses',
    allowance: 'Allowance',
    allowances: 'Allowances',
    allowances_processed: 'Allowances Processed',
    am: 'AM',
    american: 'American',
    annual: 'Annual',
    annual_leave: 'Annual Leave',
    appearance: 'Appearance',
    appearance_subtitle: 'Customize the look and feel of your dashboard',
    approval_review: 'Approval Review',
    approvals_inbox: 'Approvals Inbox',
    approve: 'Approve',
    approve_correction: 'Approve Correction',
    approve_correction_confirm: 'You are about to approve the attendance correction for {name} on {date}.',
    approve_failed: 'Failed to approve payroll run',
    approve_request: 'Approve Request',
    approve_run: 'Approve Run',
    approve_success: 'Payroll run approved successfully',
    approved: 'Approved',
    approved_at: 'Approved At',
    approved_by: 'Approved By',
    approving: 'Approving...',
    arabic: 'Arabic',
    archive: 'Archive',
    archived: 'Archived',
    are_you_sure: 'Are you sure?',
    assigned: 'Assigned',
    assigned_shift: 'Assigned Shift',
    assigned_to: 'Assigned To',
    assignment_details: 'Assignment Details',
    attachment_hint: 'Required for Sick or Compassionate leave',
    attachments: 'Attachments',
    attendance: 'Attendance',
    attendance_imported: 'Attendance Data Imported',
    attendance_imported_success: 'Attendance data imported successfully',
    attendance_log: 'Attendance Log',
    attendance_export_success: 'Attendance log exported successfully',
    attendance_manual_entry_hint: 'Manual attendance entry is coming soon.',
    attendance_monthly_summary: 'Monthly Attendance Summary',
    attendance_mgmt: 'Attendance Management',
    attendance_reminders: 'Attendance Reminders',
    attendance_subtitle: 'Track daily attendance, manage corrections, and monitor overtime.',
    attendance_trend: 'Attendance Trend (Weekly)',
    audit_log_policy_msg: '* Audit logs are immutable and retained for 7 years per compliance policy.',
    availability: 'Availability',
    availability_status: 'Availability Status',
    available: 'Available',
    avg_monthly_net: 'Avg. Monthly Net',
    back: 'Back',
    base_salary: 'Base Salary',
    basic_details: 'Basic Details',
    basic_info: 'Basic Info',
    board_certification: 'Board Certification',
    bs_nursing: 'Bachelor of Science in Nursing',
    bulk_generate: 'Bulk Generate',
    bulk_generate_success: 'Bulk generation completed successfully',
    bulk_generating_msg: 'Bulk generating {count} payslips...',
    busy: 'Busy',
    calc_failed: 'Failed to calculate payroll',
    calc_method: 'Calc Method',
    calc_success: 'Payroll calculation completed successfully',
    calculate_payroll: 'Calculate Payroll',
    calculated: 'Calculated',
    calculating: 'Calculating...',
    cancel: 'Cancel',
    cancel_confirm_msg: 'Are you sure you want to cancel? All entered information will be lost.',
    candidates: 'Candidates',
    cardiology: 'Cardiology',
    case_closed_success: 'Incident case has been closed',
    category: 'Category',
    cert_training: 'Certifications & Training',
    change: 'Change',
    change_candidate: 'Change Candidate',
    change_password: 'Change Password',
    check_in: 'Check-in',
    check_in_out: 'Check-in / Out',
    check_in_success: 'Checked in successfully. Have a great shift!',
    check_in_success_late: 'Checked in successfully. Note: You are marked as late.',
    check_out: 'Check-out',
    check_out_success: 'Checked out successfully. See you tomorrow!',
    checked_in: 'Checked-in',
    checked_out: 'Checked-out',
    checkup_details: 'Checkup Details',
    checkup_scheduled_failed: 'Failed to schedule checkup',
    checkup_scheduled_success: 'Medical checkup scheduled successfully',
    choose_columns: 'Choose Columns',
    click_to_upload: 'Click to upload or drag and drop',
    clock_in: 'Clock In',
    close_case: 'Close Case',
    closed_date: 'Closed Date',
    closure_note: 'Closure Note',
    closure_note_placeholder: 'Provide a reason for closing this case...',
    code: 'Code',
    collapse_menu: 'Collapse Menu',
    comment_placeholder: 'Add a comment for the record...',
    compassionate: 'Compassionate',
    complete_onboarding: 'Complete Onboarding',
    completed: 'Completed',
    completed_annual_training: 'Completed Annual Training',
    compliance_access: 'Compliance Access',
    compliance_alerts: 'Compliance Alerts',
    compliance_documents: 'Compliance & Documents',
    compliance_rate: 'Compliance Rate',
    contract: 'Contract',
    compliance_subtitle: 'Manage professional licenses, certifications, and unified document storage.',
    compliance_training_desc: 'Mandatory compliance and safety training completed on {date}',
    component_added_success: 'Payroll component added successfully',
    component_name: 'Component Name',
    components: 'Components',
    confidential_findings: 'Confidential Findings',
    confidential_notes: 'Confidential Notes',
    confidential_notes_placeholder: 'Confidential notes for OHO only...',
    confirm: 'Confirm',
    confirm_cancel: 'Confirm Cancel',
    confirm_close_case: 'Confirm & Close Case',
    confirm_deactivation: 'Confirm Deactivation',
    confirm_logout: 'Are you sure you want to logout?',
    confirm_new_password: 'Confirm New Password',
    confirm_reject: 'Confirm Reject',
    confirm_rejection: 'Confirm Rejection',
    confirmed: 'Confirmed',
    conflicts_detected: 'Conflicts Detected',
    consultation: 'Consultation',
    contact_details: 'Contact Details',
    contact_during_leave: 'Contact During Leave',
    contact_information: 'Contact Information',
    contact_placeholder: 'Phone number or emergency contact',
    continue: 'Continue',
    contract_agreement: 'Contract Agreement',
    contract_information: 'Contract Information',
    contract_type: 'Contract Type',
    core_data: 'Core Data',
    correction_reason_placeholder: 'Explain why a correction is needed...',
    correction_request_details: 'Correction Request Details',
    correction_requests: 'Correction Requests',
    coverage_analysis: 'Coverage Analysis',
    create_feb_run: 'Create February Run',
    create_new_employee: 'Create New Employee',
    create_new_run: 'Create New Run',
    create_policy: 'Create Policy',
    create_system_login: 'Create System Login',
    credentials_documents: 'Credentials & Documents',
    critical: 'Critical',
    current_duration: 'Current Duration',
    current_password: 'Current Password',
    current_run_status: 'Current Run Status',
    current_stage: 'Current Stage',
    current_status: 'Current Status',
    current_system_time: 'Current System Time',
    cv_format_hint: 'PDF, DOCX up to 10MB',
    dashboard: 'Dashboard',
    dashboard_subtitle: 'Monitor hospital operations and HR metrics.',
    data_management: 'Data Management',
    data_management_desc: 'Backup schedules, data retention policies, and export/import tools.',
    date: 'Date',
    date_of_birth: 'Date of Birth',
    day: 'Day',
    day_shift: 'Day Shift',
    deactivate: 'Deactivate',
    deactivate_confirm_message: 'This will mark their doctor record as inactive.',
    deactivate_confirm_question: 'Are you sure you want to deactivate',
    deactivate_doctor: 'Deactivate Doctor',
    deactivate_reason: 'Reason for deactivation',
    deactivation_started: 'Deactivation process started for {code}.',
    deduction: 'Deduction',
    deductions: 'Deductions',
    delete: 'Delete',
    department: 'Department',
    departments: 'Departments',
    dept_distribution: 'Department Distribution',
    dept_placeholder: 'e.g. Nursing',
    dermatology: 'Dermatology',
    description: 'Description',
    description_placeholder: 'e.g. Responsible for patient care in the ICU...',
    details: 'Details',
    display_columns: 'Display Columns',
    dob: 'Date of Birth',
    doc: 'Doc',
    doc_national_id: 'National ID / Passport',
    doc_preview_placeholder: 'Document Preview Placeholder',
    doc_professional_license: 'Professional License',
    doctor: 'Doctor',
    doctor_code: 'Doctor Code',
    doctor_onboarded: '{code} has been successfully onboarded.',
    doctor_updated: '{code} has been updated.',
    doctors: 'Doctors',
    doctors_subtitle: 'Manage doctor credentials, specialties, and clinical status.',
    document_center: 'Document Center',
    document_deleted_success: 'Document deleted successfully',
    document_name: 'Document Name',
    document_preview: 'Document Preview',
    documents: 'Documents',
    dose: 'Dose',
    download: 'Download',
    download_all: 'Download All',
    download_pdf: 'Download PDF',
    download_report: 'Download Report',
    draft: 'Draft',
    draft_mode: 'Draft Mode',
    draft_saving_soon: 'Draft saving is coming soon.',
    due_date: 'Due Date',
    duration: 'Duration',
    duration_hours: 'Duration (Hours)',
    edit: 'Edit',
    edit_details: 'Edit Details',
    edit_doctor: 'Edit Doctor',
    edit_permissions: 'Edit Permissions',
    education: 'Education',
    eg_travel_allowance: 'e.g. Travel Allowance',
    email: 'Email',
    email_address: 'Email Address',
    email_notifications: 'Email Notifications',
    email_notifications_desc: 'Receive updates via email',
    email_placeholder: 'e.g. john@example.com',
    emergency: 'Emergency',
    emergency_contact: 'Emergency Contact',
    emergency_medicine: 'Emergency Medicine',
    emp_id_placeholder: 'e.g. EMP-001',
    employee: 'Employee',
    employee_added_success: 'Employee added successfully',
    employee_data_exported: 'Employee data exported successfully',
    employee_details: 'Employee Details',
    employee_id: 'Employee ID',
    employee_name: 'Employee Name',
    employee_no: 'Employee No',
    employee_profile: 'Employee Profile',
    employee_reviews: 'Employee Reviews',
    employees_subtitle: 'Manage hospital staff and their records.',
    employment_details: 'Employment Details',
    enable_2fa: 'Enable 2FA',
    enable_extra_pay_night: 'Enable extra pay for night shifts',
    enable_extra_pay_weekend: 'Enable extra pay for weekend shifts',
    enable_pay_on_call: 'Enable pay for on-call duties',
    end_date: 'End Date',
    end_date_after_start: 'End date must be after start date',
    end_date_required: 'End date is required',
    english: 'English',
    end_time: 'End Time',
    entity_id: 'Entity ID',
    entity_type: 'Entity Type',
    error_creating_template: 'Error creating template',
    error_fetching_analytics: 'Error fetching analytics',
    error_updating_status: 'Error updating status',
    eval_cycles: 'Evaluation Cycles',
    eval_templates: 'Evaluation Templates',
    evening_shift: 'Evening Shift',
    exception_summary: 'Exception Summary',
    exceptions_found: 'Exceptions Found',
    exit: 'Exit',
    expand_menu: 'Expand Menu',
    experience_placeholder: 'e.g. 5',
    expired: 'Expired',
    expires_in_days: 'Expires in {days} days',
    expiring: 'Expiring',
    expiring_docs: 'Expiring Docs',
    expiring_soon: 'Expiring Soon',
    expiring_this_week: 'Expiring This Week',
    expiry_date: 'Expiry Date',
    export: 'Export',
    export_csv: 'Export CSV',
    export_expiry_list: 'Export Expiry List',
    export_history: 'Export History',
    export_org_chart: 'Export Org Chart',
    export_pdf: 'Export PDF',
    export_sheet: 'Export Sheet',
    exposure: 'Exposure',
    extreme_values: 'Extreme Values',
    failed: 'Failed',
    failed_fetch_data: 'Failed to fetch data',
    failed_fetch_history: 'Failed to fetch payroll history',
    failed_fetch_reviews: 'Failed to fetch payroll reviews',
    hours: 'hours',
    hours_short: 'h',
    minutes: 'minutes',
    minutes_short: 'm',
    send_to_payroll: 'Send to Payroll',
    missing_checkouts: 'Missing Check-outs',
    feature_coming_soon: 'Feature coming soon',
    feedback_placeholder: 'Detailed feedback...',
    female: 'Female',
    field_required: 'This field is required',
    file_name: 'File Name',
    filter: 'Filter',
    filter_by_type: 'Filter by Type',
    filter_by_dept: 'Filter by Department',
    apply_filters: 'Apply Filters',
    filters_applied_successfully: 'Filters applied successfully',
    reset_filters: 'Reset Filters',
    finance: 'Finance',
    first_name: 'First Name',
    first_name_placeholder: 'e.g. John',
    fixed: 'Fixed',
    flags: 'Flags',
    follow_up: 'Follow-up',
    follow_up_completed_success: 'Follow-up task marked as completed',
    follow_up_details: 'Follow-up Details',
    follow_ups: 'Follow-ups',
    forgot_password: 'Forgot password?',
    reset_password_title: 'Reset Password',
    reset_password_subtitle: 'Enter your email to receive a reset link',
    send_reset_link: 'Send Reset Link',
    back_to_login: 'Back to Login',
    reset_link_sent: 'A reset link has been sent to your email address.',
    formula: 'Formula',
    fri: 'Friday',
    full_access: 'Full Access',
    full_calendar_view: 'Full Calendar View',
    full_name: 'Full Name',
    full_name_placeholder: 'e.g. John Doe',
    full_time: 'Full Time',
    future_backend_integration_required: 'Future Backend Integration Required',
    gender: 'Gender',
    general_settings: 'General Settings',
    general_settings_desc: 'Configure hospital name, branding, localization, and default timezone.',
    general_surgery: 'General Surgery',
    generate_report: 'Generate Report',
    generated_at: 'Generated At',
    generated_reports: 'Generated Reports',
    global: 'Global',
    go_back: 'Go Back',
    go_home: 'Go Home',
    head_nurse: 'Head Nurse',
    headcount: 'Headcount',
    operational_overview: 'Operational overview',
    system_status: 'System status',
    active_employees: 'Active employees',
    open_positions: 'Open positions',
    department_distribution: 'Attendance by department',
    team_status: 'Team status',
    recruitment_funnel: 'Candidate pipeline by stage',
    on_duty: 'On duty',
    present: 'Present',
    exceptions: 'Exceptions',
    no_data: 'No data',
    health: 'Occupational Health',
    health_certificate: 'Health Certificate',
    health_subtitle: 'Manage workplace safety, employee health records, and medical compliance.',
    high: 'High',
    hire_date: 'Hire Date',
    hospital_anniversary: 'Hospital Anniversary',
    hospital_mgmt_system: 'Hospital Resource Management System',
    hr: 'Human Resources',
    hr_manager_only: 'HR Manager Only',
    hr_view: 'HR View',
    human_resources: 'Human Resources',
    id: 'ID',
    identification: 'Identification',
    illness: 'Illness',
    import_attendance: 'Import Attendance',
    incident_description_placeholder: 'Describe the incident in detail...',
    incident_details: 'Incident Details',
    incident_reported_failed: 'Incident report failed',
    incident_reported_success: 'Incident reported successfully',
    incidents: 'Incidents',
    injury: 'Injury',
    internal_comments: 'Internal Comments',
    internal_medicine: 'Internal Medicine',
    interviewers_placeholder: 'e.g. Dr. House, Nurse Joy',
    interviews: 'Interviews',
    invalid_email: 'Please enter a valid email address',
    issue: 'Issue',
    issue_date: 'Issue Date',
    issuing_authority: 'Issuing Authority',
    it: 'Information Technology',
    job_assignment: 'Job & Assignment',
    job_openings: 'Job Openings',
    job_title_placeholder: 'e.g. Senior Registered Nurse',
    laboratory: 'Laboratory',
    language: 'Language',
    last_name: 'Last Name',
    last_name_placeholder: 'e.g. Doe',
    last_review: 'Last Review',
    late: 'Late',
    late_min: 'Late (min)',
    late_penalty_applied: 'Late Penalty Applied',
    late_unpaid: 'Late & Unpaid',
    latest_payslip_summary: 'Latest Payslip Summary',
    leave_balances: 'Leave Balances',
    leave_calendar: 'Leave Calendar',
    leave_deductions_applied: 'Leave Deductions Applied',
    leave_mgmt: 'Leave Management',
    leave_overlap: 'Leave Overlap',
    leave_reason_placeholder: 'Please provide a detailed reason for your leave request...',
    leave_request_approved: 'Leave Request Approved',
    leave_requests: 'Leave Requests',
    leave_request_details: 'Leave Request Details',
    my_requests: 'My Requests',
    team_requests: 'Team Requests',
    all_requests: 'All Requests',
    search_leave_placeholder: 'Search by name, ID, or leave type...',
    new_leave_request: 'New Leave Request',
    stage_status: 'Stage/Status',
    reject_request: 'Reject Request',
    currently_at: 'Currently at',
    scheduling_block_hint: 'Scheduling will block shifts for these dates automatically.',
    approval_history: 'Approval History',
    dept_manager_approval: 'Department Manager Approval',
    hr_final_approval: 'HR Final Approval',
    approved_by_on: 'Approved by {{name}} on {{date}}',
    rejected_at_stage: 'Rejected at this stage',
    pending_review: 'Pending review',
    days: 'Days',
    request_details: 'Request Details',
    on: 'on',
    leave_subtitle: 'Track, approve, and manage employee leave requests and balances.',
    leave_type: 'Leave Type',
    leave_type_required: 'Leave type is required',
    leaves: 'Leaves',
    license_credentials: 'License & Credentials',
    license_expiry: 'License Expiry',
    license_name: 'License Name',
    license_number: 'License Number',
    license_placeholder: 'ABC-12345678',
    license_status: 'License Status',
    licenses: 'Licenses',
    licensing_authority: 'Licensing Authority',
    link_candidate: 'Link from Recruitment',
    link_candidate_desc: 'Import data from a successful recruitment candidate.',
    link_employee: 'Link Employee',
    link_existing_employee: 'Link Existing Employee',
    linked_to: 'Linked To',
    loading: 'Loading...',
    loading_candidates: 'Loading candidates...',
    loading_data: 'Loading data...',
    location: 'Location',
    location_placeholder: 'e.g. Main Hall, Floor 2',
    lock_failed: 'Failed to lock payroll run',
    lock_run: 'Lock Run',
    locked: 'Locked',
    login_error_empty: 'Please enter both username/email and password.',
    logout: 'Logout',
    low: 'Low',
    main_hospital: 'Main Hospital',
    maintenance: 'Maintenance',
    male: 'Male',
    manage_data: 'Manage Data',
    manage_notifications: 'Manage Notifications',
    manage_privacy: 'Manage Privacy',
    manage_security: 'Manage Security',
    manage_settings: 'Manage Settings',
    manual_entry: 'Manual Entry',
    manual_entry_desc: 'Start from scratch and enter all details manually.',
    march: 'March',
    mark_all_seen: 'Mark all as seen',
    mark_as_seen: 'Mark as seen',
    mark_completed: 'Mark as Completed',
    mark_renewed: 'Mark Renewed',
    marketing_emails: 'Marketing Emails',
    marketing_emails_desc: 'News about features and updates',
    maternity: 'Maternity',
    max_hours_day: 'Max Hours/Day',
    max_hours_week: 'Max Hours/Week',
    max_ot: 'Max OT',
    medical: 'Medical',
    medical_checkup: 'Medical Checkup',
    medical_checkups: 'Medical Checkups',
    medical_license_details: 'Medical License Details',
    medical_license_no: 'Medical License #',
    medical_license_placeholder: 'e.g. ML-12345',
    medical_license_scan: 'Medical License Scan',
    medical_staff: 'Medical Staff',
    medistaff_hr: 'OryxStaff',
    missing_co: 'Missing CO',
    medium: 'Medium',
    min_staff: 'Min Staff',
    missing: 'Missing',
    missing_attendance: 'Missing Attendance',
    missing_checkout: 'Missing Checkout',
    missing_salary: 'Missing Salary Info',
    mock_address: 'King Fahd Road, Riyadh, Saudi Arabia',
    mock_dob: 'May 12, 1988',
    mock_emergency_contact_name: 'John Doe',
    mock_emergency_contact_relation: 'Spouse',
    mock_employee_id: 'EMP-2024-001',
    mock_hire_date: 'Jan 15, 2024',
    mock_phone: '+966 50 123 4567',
    mock_supervisor: 'Dr. Sarah Mitchell',
    mon: 'Monday',
    month: 'Month',
    morning_shift: 'Morning Shift',
    ms_nursing: 'Master of Science in Nursing',
    multiplier: 'Multiplier',
    my_attendance_rate: 'My Attendance Rate',
    my_payslips: 'My Payslips',
    my_recent_activity: 'My Recent Activity',
    name: 'Name',
    national_id: 'National ID',
    national_id_ssn: 'National ID / SSN',
    nationality: 'Nationality',
    nationality_placeholder: 'e.g. American',
    near_miss: 'Near Miss',
    negative_net: 'Negative Net Salary',
    net_payable: 'Net Payable',
    net_payroll: 'Net Payroll',
    net_salary: 'Net Salary',
    neurology: 'Neurology',
    new_custom_report: 'New Custom Report',
    new_document_optional: 'New Document (Optional)',
    new_expiry_date: 'New Expiry Date',
    new_password: 'New Password',
    new_request: 'New Request',
    next: 'Next',
    next_checkup_date: 'Next Checkup Date',
    next_review: 'Next Review',
    next_shift: 'Next Shift',
    next_step_payroll_review: 'Next Step: Payroll Review',
    night_shift: 'Night Shift',
    night_shift_allowance: 'Night Shift Allowance',
    no_actions_recorded: 'No actions recorded yet.',
    no_active_payroll_run: 'No active payroll run',
    no_alerts_found: 'No alerts found',
    no_expiring_docs: 'No expiring documents',
    no_recent_hires: 'No recent hires',
    no_one_on_leave: 'No one on leave today',
    no_attachments_provided: 'No attachments provided',
    no_candidates_found: 'No candidates found.',
    no_compliance_alerts: 'No Compliance Alerts',
    no_data_available: 'No data available',
    no_eligible_employees: 'No eligible employees found. Ensure they are active and not already doctors.',
    no_keep_editing: 'No, keep editing',
    no_recent_activity: 'No recent activity',
    no_records_found: 'No records found.',
    no_shift_scheduled: 'No shift scheduled',
    no_swap_requests: 'No active swap requests found.',
    not_available: 'Not Available',
    note: 'Note',
    notes: 'Notes',
    notes_placeholder: 'Additional information...',
    notifications: 'Notifications',
    notifications_desc: 'Email server (SMTP) configuration and system-wide push notification rules.',
    notifications_subtitle: 'Control how and when you receive updates',
    number: 'Number',
    nurse: 'Nurse',
    nursing: 'Nursing',
    nursing_license: 'Nursing License',
    occupational_health: 'Occupational Health',
    off: 'Off',
    offers: 'Offers',
    oho: 'Occupational Health Officer',
    oho_only: 'OHO Only',
    ok: 'OK',
    on_call: 'On-Call',
    on_call_allowance: 'On-Call Allowance',
    on_call_status: 'On-Call Status',
    on_leave: 'On Leave',
    on_leave_today: 'Who is on Leave Today',
    onboard_doctor: 'Onboard New Doctor',
    onboarding_path: 'Onboarding Path',
    onboarding_path_desc: 'Choose how you want to start the onboarding process',
    once_locked_review: 'Once the run is locked, it will be available for detailed review and approval by the Payroll Officer or HR Manager.',
    open_fullscreen: 'Open Fullscreen',
    operations: 'Operations',
    optional: 'Optional',
    org_chart_engine_offline: 'Org Chart Engine Offline',
    org_chart_engine_offline_desc: 'The organizational chart visualization engine requires a live connection to the workforce database to map reporting structures and department hierarchies.',
    org_chart_placeholder: 'Organizational Chart Placeholder',
    org_structure: 'Org Structure',
    organization: 'Organization',
    orthopedics: 'Orthopedics',
    oryxstaff: 'OryxStaff',
    other: 'Other',
    other_document: 'Other',
    overall_coverage: 'Overall Coverage',
    overall_rating: 'Overall Rating',
    overtime: 'Overtime',
    overtime_allowed: 'Overtime Allowed',
    overtime_calculated: 'Overtime Calculated',
    overtime_late_summary: 'Overtime & Late Summary',
    overview: 'Overview',
    passport_expiry: 'Passport Expiry',
    passport_number: 'Passport Number',
    password: 'Password',
    password_recovery_demo: 'Password recovery is not implemented in this demo.',
    password_too_short: 'Password must be at least 8 characters',
    passwords_dont_match: 'Passwords do not match',
    paternity: 'Paternity',
    patient: 'Patient',
    patient_no: 'Patient #{no}',
    payroll: 'Payroll',
    payroll_history: 'Payroll History',
    payroll_history_desc: 'View and audit past payroll runs and their approvals.',
    payroll_history_subtitle: 'View past payroll runs and download historical reports.',
    payroll_mgmt: 'Payroll Management',
    payroll_officer: 'Payroll Officer',
    payroll_report: 'Payroll Report',
    payroll_review: 'Payroll Review',
    payroll_review_subtitle: 'Review employee-wise salary calculations and approve the run.',
    payroll_settings: 'Payroll Settings',
    payroll_settings_subtitle: 'Configure salary components, rules, and calculation methods.',
    payroll_status: 'Payroll Status',
    payroll_subtitle: 'Manage salary components, process payroll, and view payslips.',
    payroll_summary: 'Payroll Summary',
    payslip: 'Payslip',
    payslip_available: 'Payslip Available',
    payslip_download_success: 'Payslip downloaded successfully',
    payslips: 'Payslips',
    payslips_subtitle: 'View and download monthly payslips.',
    pediatrics: 'Pediatrics',
    peer: 'Peer',
    pending_checkups: 'Pending Checkups',
    pending_followups: 'Pending Follow-ups',
    pending_leaves: 'Pending Leaves',
    pending_queue: 'Pending',
    pending_requests: 'Pending Requests',
    pending_verification: 'Pending Verification',
    people: 'People',
    percentage: 'Percentage',
    performance: 'Performance',
    performance_active_participants: 'Active Participants',
    performance_all_employees: 'All Employees',
    performance_all_fields_required: 'All fields are required',
    performance_analytics_subtitle: 'Visual insights into organization-wide performance trends.',
    performance_analytics_title: 'Performance Analytics',
    performance_assign_evaluators: 'Assign Evaluators',
    performance_assign_evaluators_desc: 'Override default manager assignments for specific employees.',
    performance_avg_org_score: 'Avg. Organization Score',
    performance_communication: 'Communication',
    performance_competency_ratings: 'Competency Ratings',
    performance_complete_review: 'Complete Review',
    performance_completion: 'Completion',
    performance_completion_rate: 'Completion Rate',
    performance_create_new_template: 'Create New Template',
    performance_create_template: 'Create Template',
    performance_created_at: 'Created At',
    performance_created_by: 'Created By',
    performance_cycle_active: 'Cycle activated successfully',
    performance_cycle_closed: 'Cycle closed successfully',
    performance_cycle_created: 'New evaluation cycle created as draft',
    performance_cycle_finalized: 'Cycle finalized successfully',
    performance_cycle_name: 'Cycle Name',
    performance_cycle_note: 'Starting a cycle will notify all participants and their managers. By default, direct managers are assigned as evaluators.',
    performance_cycle_placeholder: 'e.g. 2024 Mid-Year Review',
    performance_cycle_progress: 'Cycle Completion Progress',
    performance_cycle_status_updated: 'Cycle status updated to {{status}}',
    performance_cycles_subtitle: 'Launch and monitor performance review periods.',
    performance_cycles_title: 'Evaluation Cycles',
    performance_dept_averages: 'Department Averages',
    performance_development_plan: 'Development Plan',
    performance_discipline: 'Discipline',
    performance_draft_saved: 'Performance review draft saved successfully',
    performance_draft_saved_success: 'Draft saved successfully',
    performance_due_date: 'Due Date',
    performance_edit_template: 'Edit Template',
    performance_employee: 'Employee',
    performance_evaluator: 'Evaluator',
    performance_evaluator_name: 'Evaluator',
    performance_failed_load_reviews: 'Failed to load reviews data',
    performance_failed_submit: 'Failed to submit review',
    performance_failed_submit_review: 'Failed to submit review',
    performance_final_assessment: 'Final Assessment',
    performance_finalize_confirmation_text: 'You are about to finalize this performance review. Once submitted, it cannot be edited.',
    performance_finalize_results: 'Finalize Results',
    performance_fixed_sections: 'Fixed Sections',
    performance_manager_comments: 'Manager Comments',
    performance_mgmt: 'Performance Management',
    performance_my_pending_reviews: 'My Pending Reviews',
    performance_my_received_reviews: 'My Received Reviews',
    performance_overall_score: 'Overall Score',
    performance_period: 'Period',
    performance_period_type: 'Period Type',
    performance_rating_placeholder: 'Comments for {label}...',
    performance_review_details: 'Review Details',
    performance_review_submitted: 'Review submitted successfully',
    performance_reviews_subtitle: 'Track and complete employee performance evaluations.',
    performance_reviews_title: 'Performance Reviews',
    performance_save_assignments: 'Save Assignments',
    performance_save_draft: 'Save Draft',
    performance_scope: 'Scope',
    performance_score_distribution: 'Score Distribution',
    performance_specific_dept: 'Specific Department',
    performance_start_cycle: 'Start Cycle',
    performance_start_new_cycle: 'Start New Evaluation Cycle',
    performance_submit_confirmation_text: 'You are about to finalize this performance review. Once submitted, it cannot be edited.',
    performance_submit_review: 'Submit Review',
    performance_subtitle: 'Manage evaluation templates, cycles, and employee performance reviews.',
    performance_summary: 'Performance Summary',
    performance_teamwork: 'Teamwork',
    performance_technical_skills: 'Technical Skills',
    performance_template: 'Template',
    performance_template_archived: 'Template archived successfully',
    performance_template_created: 'Template created as draft',
    performance_template_name: 'Template Name',
    performance_template_name_required: 'Template name is required',
    performance_template_placeholder: 'e.g. Annual Performance Review',
    performance_template_published: 'Template published successfully',
    performance_template_status_updated: 'Template status updated to {{status}}',
    performance_templates_subtitle: 'Manage your performance review forms and criteria.',
    performance_templates_title: 'Evaluation Templates',
    performance_timeline: 'Timeline',
    performance_top_performers: 'Top Performers',
    performance_top_rated_employees: 'Top Rated Employees',
    performance_update_template: 'Update Template',
    performance_version: 'Version',
    period: 'Period',
    periodic: 'Periodic',
    personal_details: 'Personal Details',
    personal_information: 'Personal Information',
    pharmacy: 'Pharmacy',
    phone: 'Phone',
    phone_number: 'Phone Number',
    phone_placeholder: 'e.g. +123456789',
    physician: 'Physician',
    physician_placeholder: 'e.g. Dr. Sarah Smith',
    please_wait: 'Please wait...',
    pm: 'PM',
    policies: 'Policies',
    policy_violation: 'Policy Violation',
    position: 'Position',
    position_placeholder: 'e.g. Registered Nurse',
    positions: 'Positions',
    pre_employment: 'Pre-employment',
    previous: 'Previous',
    primary_gradient: 'Primary Gradient',
    primary_role: 'Primary Role',
    primary_specialty: 'Primary Specialty',
    primary_specialty_desc: 'Main area of practice and clinical responsibility.',
    print: 'Print',
    privacy_gdpr: 'Privacy & GDPR',
    privacy_gdpr_desc: 'Configure data processing agreements and privacy policy links.',
    probation_end: 'Probation End',
    probation_period: 'Probation Period',
    process_payroll: 'Process Payroll',
    processed_queue: 'Processed',
    prof_licenses: 'Professional Licenses',
    professional_summary: 'Professional Summary',
    profile: 'My Profile',
    profile_settings_subtitle: 'Update your personal information and public profile',
    profile_subtitle: 'Manage your personal and professional information',
    provide_closure_note: 'Provide Closure Note',
    provide_expiry_date: 'Please select a new expiry date.',
    provide_rejection_reason: 'Please provide a rejection reason',
    provider: 'Provider',
    provider_placeholder: 'e.g. Main Clinic',
    publish: 'Publish',
    publish_schedule: 'Publish Schedule',
    published: 'Published',
    push_notifications: 'Push Notifications',
    push_notifications_desc: 'Receive real-time browser alerts',
    qualification: 'Qualification',
    qualification_details: 'Qualification Details',
    quarterly: 'Quarterly',
    quick_assign: 'Quick Assign',
    quick_links: 'Quick Links',
    radiology: 'Radiology',
    read_only_view: 'Read-only view',
    reason: 'Reason',
    reason_closing_placeholder: 'e.g. Position filled, no longer needed...',
    reason_for_correction: 'Reason for Correction',
    reason_placeholder: 'Enter reason here...',
    reason_rejection_placeholder: 'e.g. Budget constraints, position on hold...',
    reason_required: 'Reason is required',
    recent_activity: 'Recent Activity',
    recently_deleted: 'Recently Deleted',
    recommendations: 'Recommendations',
    recruitment: 'Recruitment',
    recruitment_about_to_create_employee: 'You are about to create a new employee record from this candidate.',
    recruitment_add_candidate: 'Add Candidate',
    recruitment_all_departments: 'All Departments',
    recruitment_all_statuses: 'All Statuses',
    recruitment_allowances: 'Allowances (Annual)',
    recruitment_accepted: 'Accepted',
    recruitment_applied: 'Applied',
    recruitment_approved: 'Approved',
    recruitment_approve: 'Approve',
    recruitment_approve_offer: 'Approve Offer',
    recruitment_back: 'Back',
    recruitment_base_salary: 'Base Salary (Annual)',
    recruitment_cancel: 'Cancel',
    recruitment_cancel_confirmation_text: 'You are about to cancel the interview for {{name}}. This action cannot be undone.',
    recruitment_cancelled: 'Cancelled',
    recruitment_candidate: 'Candidate',
    recruitment_candidate_added_success: 'Candidate added successfully.',
    recruitment_candidate_details: 'Candidate Details',
    recruitment_candidate_editing_soon: 'Candidate editing coming soon',
    recruitment_candidate_hired_success: 'Candidate {{name}} marked as Hired.',
    recruitment_candidate_moved_interview: 'Candidate {{name}} moved to Interview. Schedule interview now?',
    recruitment_candidate_moved_offer: 'Candidate {{name}} moved to Offer. Create offer draft now?',
    recruitment_candidate_moved_to: 'Moved {{name}} to {{stage}}',
    recruitment_candidate_pipeline: 'Candidate Pipeline',
    recruitment_candidate_profile: 'Candidate Profile',
    recruitment_candidate_rejected_success: 'Candidate rejected.',
    recruitment_candidates: 'Candidates',
    recruitment_close_job_opening: 'Close Job Opening',
    recruitment_close_job_opening_msg: 'This will also close the associated job opening.',
    recruitment_close_opening: 'Close Opening',
    recruitment_closed: 'Closed',
    recruitment_completed: 'Completed',
    recruitment_confirm_close: 'Confirm Close',
    recruitment_confirm_decline: 'Confirm Decline',
    recruitment_confirm_reject: 'Confirm Rejection',
    recruitment_confirm_reject_btn: 'Confirm Reject',
    recruitment_contract_type: 'Contract Type',
    recruitment_convert_to_employee: 'Convert to Employee',
    recruitment_convert_wizard_title: 'Convert Candidate to Employee',
    recruitment_create_opening: 'Create Opening',
    recruitment_created_at: 'Created At',
    recruitment_date: 'Date',
    recruitment_date_time: 'Date & Time',
    recruitment_decline_reason: 'Decline reason',
    recruitment_decline_reason_desc: 'Please provide a reason why the candidate declined the offer.',
    recruitment_decline_reason_placeholder: 'Decline reason (e.g. Salary too low, Accepted another offer)...',
    recruitment_decline_reason_prompt: 'Please provide a reason for the candidate declining the offer.',
    recruitment_department: 'Department',
    recruitment_draft: 'Draft',
    recruitment_education_not_specified: 'Not specified',
    recruitment_email: 'Email',
    recruitment_entry: 'Entry Level',
    recruitment_experience: 'Experience (Years)',
    recruitment_experience_level: 'Experience Level',
    recruitment_fail: 'Fail',
    recruitment_failed_action: 'Action failed.',
    recruitment_failed_add: 'Failed to add candidate',
    recruitment_failed_decline: 'Failed to decline offer',
    recruitment_failed_generate: 'Failed to generate offer',
    recruitment_failed_generate_offer: 'Failed to generate offer',
    recruitment_failed_load_interviews: 'Failed to load interviews data',
    recruitment_failed_load_offers: 'Failed to load offers data',
    recruitment_failed_load_openings: 'Failed to load job openings',
    recruitment_failed_load_pipeline: 'Failed to load pipeline data',
    recruitment_failed_move: 'Failed to move candidate',
    recruitment_failed_record: 'Failed to record result',
    recruitment_failed_reject: 'Failed to reject candidate',
    recruitment_failed_schedule: 'Failed to schedule interview',
    recruitment_final: 'Final',
    recruitment_finalize_create: 'Finalize & Create',
    recruitment_full_name: 'Full Name',
    recruitment_generate_draft: 'Generate Draft',
    recruitment_generate_offer: 'Generate Offer',
    recruitment_hire_date: 'Hire Date',
    recruitment_hired: 'Hired',
    recruitment_hiring_manager: 'Hiring Manager',
    recruitment_hr: 'HR',
    recruitment_internship: 'Internship',
    recruitment_interview: 'Interview',
    recruitment_interview_cancelled_success: 'Interview cancelled successfully',
    recruitment_interview_editing_soon: 'Interview editing is coming soon.',
    recruitment_interview_scheduled: 'Interview scheduled successfully.',
    recruitment_interview_type: 'Interview Type',
    recruitment_interviewer: 'Interviewer',
    recruitment_interviewers: 'Interviewers',
    recruitment_interviews: 'Interviews',
    recruitment_invalid_selection: 'Invalid candidate or opening selected.',
    recruitment_job_description: 'Job Description',
    recruitment_job_description_placeholder: 'Job description...',
    recruitment_job_details: 'Job Opening Details',
    recruitment_job_opening: 'Job Opening',
    recruitment_job_openings: 'Job Openings',
    recruitment_job_title: 'Job Title',
    recruitment_lead: 'Lead / Management',
    recruitment_location_link: 'Location / Link',
    recruitment_mark_accepted: 'Mark Accepted',
    recruitment_mark_as_declined: 'Mark Offer as Declined',
    recruitment_mark_declined: 'Mark Declined',
    recruitment_mid: 'Mid Level',
    recruitment_nationality: 'Nationality',
    recruitment_new_candidate: 'New Candidate',
    recruitment_new_job_opening: 'New Job Opening',
    recruitment_next: 'Next',
    recruitment_no_candidates: 'No candidates',
    recruitment_no_permission_action: 'You do not have permission to perform this action.',
    recruitment_no_permission_add: 'You do not have permission to add candidates.',
    recruitment_no_permission_generate: 'You do not have permission to generate offers.',
    recruitment_no_permission_generate_offer: 'You do not have permission to generate offers.',
    recruitment_no_permission_move: 'You do not have permission to move candidates.',
    recruitment_no_permission_record: 'You do not have permission to record interview results.',
    recruitment_no_permission_schedule: 'You do not have permission to schedule interviews.',
    recruitment_notes: 'Notes / Special Terms',
    recruitment_offer: 'Offer',
    recruitment_offer_accepted: 'Offer marked as Accepted.',
    recruitment_offer_approved: 'Offer approved.',
    recruitment_offer_declined_success: 'Offer marked as Declined.',
    recruitment_offer_generated: 'Offer generated as Draft.',
    recruitment_offer_sent: 'Offer sent.',
    recruitment_offers: 'Offers',
    recruitment_open: 'Open',
    recruitment_opening_approved: 'Opening approved and opened.',
    recruitment_opening_closed: 'Job opening closed',
    recruitment_opening_created_draft: 'Job opening created as Draft.',
    recruitment_opening_rejected: 'Job opening rejected',
    recruitment_opening_submitted: 'Opening submitted for approval.',
    recruitment_outcome: 'Outcome',
    recruitment_panel: 'Panel',
    recruitment_pass: 'Pass',
    recruitment_passed: 'Passed',
    recruitment_pending: 'Pending',
    recruitment_pending_approval: 'Pending Approval',
    recruitment_permissions: 'Permissions',
    recruitment_phone: 'Phone',
    recruitment_position: 'Position',
    recruitment_position_type: 'Position Type',
    recruitment_primary_role: 'Primary Role',
    recruitment_priority: 'Priority',
    recruitment_priority_high: 'High',
    recruitment_priority_low: 'Low',
    recruitment_priority_medium: 'Medium',
    recruitment_proposed_start_date: 'Proposed Start Date',
    recruitment_provide_reason: 'Please provide a reason.',
    recruitment_provide_reason_error: 'Please provide a reason',
    recruitment_provide_rejection_reason: 'Please provide a reason for rejection.',
    recruitment_ready_finalize: 'Ready to Finalize?',
    recruitment_reason_closing_placeholder: 'Provide reason for closing...',
    recruitment_reason_rejection_placeholder: 'Provide reason for rejection...',
    recruitment_record_result: 'Record Result',
    recruitment_reject: 'Reject',
    recruitment_reject_candidate: 'Reject Candidate',
    recruitment_reject_job_opening: 'Reject Job Opening',
    recruitment_reject_opening_msg: 'Are you sure you want to reject this job opening request?',
    recruitment_rejected: 'Rejected',
    recruitment_rejection_reason_msg: 'Please provide a reason for rejecting {{name}}.',
    recruitment_rejection_reason_placeholder: 'Reason for rejection...',
    recruitment_requirements: 'Requirements',
    recruitment_requirements_placeholder: 'List key requirements...',
    recruitment_result_recorded: 'Interview result recorded',
    recruitment_resume_cv: 'Resume / CV',
    recruitment_salary: 'Salary',
    recruitment_save: 'Save',
    recruitment_save_result: 'Save Result',
    recruitment_schedule_interview: 'Schedule Interview',
    recruitment_scheduled: 'Scheduled',
    recruitment_score: 'Score',
    recruitment_screening: 'Screening',
    recruitment_search_placeholder: 'Search by title, department or ID...',
    recruitment_select_outcome_error: 'Please select an outcome.',
    recruitment_senior: 'Senior Level',
    recruitment_sent: 'Sent',
    recruitment_source: 'Source',
    recruitment_start_date: 'Start Date',
    recruitment_status: 'Status',
    recruitment_step_confirm_data: 'Confirm Data',
    recruitment_step_finalize: 'Finalize',
    recruitment_step_job_assignment: 'Job Assignment',
    recruitment_step_roles_access: 'Roles & Access',
    recruitment_submit_approval: 'Submit for Approval',
    recruitment_submit_for_approval: 'Submit for Approval',
    recruitment_subtitle: 'Manage internal job openings, candidates, and hiring process.',
    recruitment_supervisor: 'Supervisor',
    recruitment_technical: 'Technical',
    recruitment_time: 'Time',
    recruitment_vacancies: 'Vacancies',
    recruitment_view_details: 'View Details',
    recruitment_view_pipeline: 'View Pipeline',
    recruitment_withdrawn: 'Withdrawn',
    referral: 'Referral',
    refresh_data: 'Refresh Data',
    reject: 'Reject',
    reject_correction_hint: 'Please provide a reason for rejecting this correction request. This will be visible to the employee.',
    reject_correction_request: 'Reject Correction Request',
    reject_verification: 'Reject Verification',
    rejected: 'Rejected',
    rejection_failed: 'Rejection failed',
    rejection_reason: 'Rejection Reason',
    rejection_reason_desc: 'Please provide a reason for rejecting this request. This will be visible to the requester.',
    rejection_reason_placeholder: 'Enter reason for rejection...',
    rejection_success: 'Rejection successful',
    hospital_name_label: 'Hospital Name',
    logo_label: 'Hospital Logo',
    upload_logo: 'Upload Logo',
    language_label: 'System Language',
    timezone_label: 'Timezone',
    gulf_standard_time: 'Gulf Standard Time (UTC+4)',
    arabian_standard_time: 'Arabian Standard Time (UTC+3)',
    security_level: 'Security Level',
    strong: 'Strong',
    sms_alerts: 'SMS Alerts',
    gdpr_compliance: 'GDPR Compliance Mode',
    gdpr_compliance_desc: 'Enforce strict data handling policies',
    data_retention: 'Data Retention Period (Years)',
    main_campus: 'Main Campus',
    west_wing: 'West Wing',
    east_wing: 'East Wing',
    outpatient_clinic: 'Outpatient Clinic',
    research_center: 'Research Center',
    level_department: 'Department',
    level_unit: 'Unit',
    level_section: 'Section',
    top_level: 'None (Top Level)',
    action_create: 'CREATE',
    action_update: 'UPDATE',
    action_delete: 'DELETE',
    action_login: 'LOGIN',
    action_logout: 'LOGOUT',
    ip_address: 'IP Address',
    user_agent: 'User Agent',
    remaining_leaves: 'Remaining Leaves',
    remember_me: 'Remember me for 30 days',
    reminder_checkout: 'Check-out cannot happen before check-in.',
    reminder_late: 'Check-ins after 08:00 are recorded as late.',
    reminder_missing: 'Missing check-outs from previous days must be corrected via "Correction Requests".',
    reminder_policy: 'Your punch is recorded automatically against your assigned shift.',
    renew_license: 'Renew License',
    renew_license_desc: 'Please select a new expiry date and upload the updated document to renew this qualification.',
    renew_qualification: 'Renew Qualification',
    renew_success: '{type} renewed successfully. New expiry: {date}',
    replacement_employee: 'Replacement Employee',
    report: 'Report',
    report_builder: 'Report Builder',
    report_catalog: 'Report Catalog',
    report_download_success: 'Report downloaded successfully',
    report_history: 'Report History',
    report_incident: 'Report Incident',
    report_incident_subtitle: 'Record a new workplace safety incident or health exposure.',
    reported_by: 'Reported By',
    reports: 'Reports',
    reports_adjust_filters: 'Try adjusting your search or category filters',
    reports_all_categories: 'All Categories',
    reports_all_departments: 'All Departments',
    reports_all_statuses: 'All Statuses',
    reports_compile_data_note: 'We\'ll compile all data across the selected period and filters.',
    reports_compliance: 'Compliance',
    reports_configure_custom: 'Configure your custom report',
    reports_customizing: 'Customizing: {name}',
    reports_data_preview: 'Data Preview (Top 50 Rows)',
    reports_download_excel: 'Download Excel',
    reports_download_pdf: 'Download PDF',
    reports_employee_optional: 'Employee (Optional)',
    reports_executive: 'Executive',
    reports_filters_applied: 'Filters Applied',
    reports_attendance_report_desc: 'Daily attendance, late arrivals, and overtime analysis.',
    reports_attendance_report_name: 'Operational Attendance Report',
    reports_budget_utilization_desc: 'Detailed breakdown of payroll and operational spending by department.',
    reports_budget_utilization_name: 'Departmental Budget Utilization',
    reports_compliance_audit_desc: 'Tracking of all license renewals and mandatory training completions.',
    reports_compliance_audit_name: 'Compliance Audit Log',
    reports_executive_summary_desc: 'High-level overview of headcount, turnover, and labor costs.',
    reports_executive_summary_name: 'Executive Workforce Summary',
    reports_financial: 'Financial',
    reports_payroll_variance_desc: 'Comparison of current month payroll vs previous month.',
    reports_payroll_variance_name: 'Payroll Variance Analysis',
    reports_recruitment_funnel_desc: 'Analysis of candidate pipeline from application to hire.',
    reports_recruitment_funnel_name: 'Recruitment Funnel Metrics',
    reports_format: 'Format',
    reports_generate_full: 'Generate Full Report',
    reports_generated_at: 'Generated At',
    reports_generated_by: 'Generated By',
    reports_generated_success: 'Report Generated Successfully!',
    reports_generating: 'Generating Report...',
    reports_id: 'ID',
    reports_id_label: 'Report ID',
    reports_immutable_note_text: 'This record is part of the immutable audit trail. Any changes to the underlying data after generation will not be reflected in this specific report instance.',
    reports_immutable_note_title: 'Immutable History Note',
    reports_metadata: 'Report Metadata',
    reports_mock_data_note: 'Showing mock data based on selected filters',
    reports_name: 'Name',
    reports_no_reports_found: 'No reports found',
    reports_open_in_builder: 'Open in Builder',
    reports_operational: 'Operational',
    reports_period: 'Period',
    reports_ready_for_download: 'Your report is ready for download and has been saved to history.',
    reports_ready_to_generate: 'Ready to Generate?',
    reports_scope_dept: 'Scope Dept',
    reports_search_employee_placeholder: 'Search for a specific employee...',
    reports_search_placeholder: 'Search reports by name or description...',
    reports_standardized_templates: 'Standardized templates for {type} metrics.',
    reports_step_filters: 'Filters',
    reports_step_generate: 'Generate',
    reports_step_preview: 'Preview',
    reports_step_type: 'Type',
    reports_subtitle: 'Generate, schedule, and analyze hospital data.',
    reports_value: 'Value',
    reports_workforce: 'Workforce',
    request_admin_access: 'Request Admin Access',
    request_for: 'Request for',
    request_leave: 'Request Leave',
    request_type: 'Request Type',
    requested_in: 'Requested In',
    requested_out: 'Requested Out',
    requester: 'Requester',
    required: 'Required',
    required_documents: 'Required Documents',
    requirements_placeholder: 'e.g. 5+ years experience, BSN degree...',
    results: 'results',
    results_analytics: 'Results & Analytics',
    results_summary: 'Results Summary',
    return_to_work: 'Return to Work',
    returns_monday: 'Returns Monday',
    role: 'Role',
    role_definitions: 'Role Definitions',
    roster_summary: 'Today\'s Roster Summary',
    rule_name: 'Rule Name',
    rules_rates: 'Rules & Rates',
    run_checklist: 'Run Checklist',
    run_create_failed: 'Failed to create payroll run',
    run_created_success: 'Payroll run created successfully',
    run_locked: 'Run Locked',
    run_locked_success: 'Payroll run locked for review',
    run_payroll_subtitle: 'Select a period and process the monthly payroll.',
    run_unlocked: 'Run Unlocked',
    run_unlocked_success: 'Payroll run unlocked',
    sat: 'Saturday',
    save: 'Save',
    save_changes: 'Save Changes',
    save_component: 'Save Component',
    save_draft: 'Save Draft',
    save_settings: 'Save Settings',
    schedule: 'Schedule',
    schedule_checkup: 'Schedule Checkup',
    schedule_checkup_subtitle: 'Schedule a new medical checkup or health assessment.',
    scheduling: 'Scheduling',
    scheduling_subtitle: 'Plan shifts, manage coverage, and handle swap requests.',
    scheduling_title: 'Workforce Scheduling',
    scope: 'Scope',
    search: 'Search...',
    search_approvals_placeholder: 'Search approvals by requester or type...',
    search_attendance_placeholder: 'Search employee, ID, or department...',
    search_candidate: 'Search Candidate',
    search_candidate_placeholder: 'Search by name or email...',
    search_checkups: 'Search checkups...',
    search_components: 'Search components...',
    search_docs_placeholder: 'Search documents by name...',
    search_employee: 'Search Employee',
    search_employee_dept: 'Search employee or department...',
    search_employee_placeholder: 'Search by name, EMP-###, or phone...',
    search_follow_ups: 'Search follow-ups...',
    search_incidents: 'Search incidents...',
    search_logs_placeholder: 'Search logs by actor, action, or ID...',
    search_org_placeholder: 'Search departments or units...',
    search_period: 'Search period...',
    search_period_approver: 'Search period or approver...',
    search_placeholder: 'Search...',
    search_placeholder_employees: 'Search by name, ID, or email...',
    search_placeholder_generic: 'Search...',
    search_qualifications_placeholder: 'Search {type}s...',
    search_to_begin: 'Search for an employee to begin linking.',
    search_users_placeholder: 'Search users by name or email...',
    search_vaccinations: 'Search vaccinations...',
    security: 'Security',
    security_alerts: 'Security Alerts',
    security_alerts_desc: 'Alerts about account security',
    security_auth: 'Security & Auth',
    security_auth_desc: 'MFA policies, password complexity rules, and session timeout configurations.',
    security_subtitle: 'Keep your account secure with password and authentication settings',
    security_tab: 'Security',
    select_candidate: 'Select Candidate',
    select_job_opening: 'Select Job Opening',
    select_language: 'Select Language',
    select_leave_type: 'Select Leave Type',
    select_period_create_run: 'Select a period and create a new run to begin.',
    select_primary_specialty: 'Select Primary Specialty',
    select_replacement: 'Select Replacement',
    select_role_demo: 'Role',
    select_theme: 'Select Theme',
    selected_candidate: 'Selected Candidate',
    settings: 'Settings',
    settings_saved_success: 'Settings saved successfully',
    settings_subtitle: 'Manage your account preferences and system settings',
    severity: 'Severity',
    severity_critical: 'Critical',
    severity_high: 'High',
    severity_low: 'Low',
    severity_medium: 'Medium',
    shift_configurations: 'Shift Configurations',
    shift_name: 'Shift Name',
    shift_code: 'Shift Code',
    shift_types: 'Shift Types',
    shifts_calendar: 'Shifts Calendar',
    showing_exceptions: 'Showing Exceptions',
    showing_results: 'Showing {start} to {end} of {total} results',
    sick: 'Sick',
    sign_in: 'Sign in',
    sign_in_subtitle: 'Please enter your details to sign in',
    specialization_certificate: 'Specialization Certificate',
    specialties: 'Specialties',
    specialty_mapping: 'Specialty Mapping',
    stage: 'Stage',
    start_date: 'Start Date',
    start_date_required: 'Start date is required',
    start_time: 'Start Time',
    state_medical_college: 'State Medical College',
    status: 'Status',
    status_closed: 'Closed',
    status_completed: 'Completed',
    status_due: 'Due',
    status_followup_required: 'Follow-up Required',
    status_open: 'Open',
    status_overdue: 'Overdue',
    status_partially_completed: 'Partially Completed',
    status_pending: 'Pending',
    status_pending_results: 'Pending Results',
    status_resolved: 'Resolved',
    status_scheduled: 'Scheduled',
    status_under_investigation: 'Under Investigation',
    submission_date: 'Submission Date',
    submit: 'Submit',
    submit_correction_request: 'Submit Correction Request',
    submit_request: 'Submit Request',
    summary: 'Summary',
    summary_access: 'Summary Access',
    sun: 'Sunday',
    supervisor: 'Supervisor',
    surgery_prep: 'Surgery Prep',
    swap_requests: 'Swap Requests',
    swap_requests_desc: 'Requests from employees will appear here for approval.',
    system_login_desc: 'Enable access to the hospital management system',
    system_settings: 'System Settings',
    system_settings_read_only_msg: 'System settings are currently read-only. Modifying these values requires a connected backend API to persist changes to the database and trigger system-wide configuration updates.',
    system_status_healthy: 'System Status: Healthy',
    tab_loading_desc: 'Detailed information for {tab} is being loaded. This section includes comprehensive records and history.',
    tags: 'Tags',
    talent: 'Talent',
    task: 'Task',
    tax_rules: 'Tax Rules',
    tax_social_security: 'Tax & Social Security',
    team_meeting: 'Team Meeting',
    technician: 'Technician',
    template: 'Template',
    terminate: 'Terminate',
    terminate_confirm_msg: 'You are about to terminate {name}. This action will revoke their access and initiate the offboarding process.',
    terminate_employee: 'Terminate Employee',
    termination_initiated: 'Termination process initiated for {name}',
    theme: 'Theme',
    theme_berry: 'Berry Rose',
    theme_forest: 'Forest Green',
    theme_indigo: 'Indigo Purple',
    theme_medical: 'Medical Green-Blue',
    theme_royal: 'Royal Blue',
    theme_sky: 'Light Sky Blue',
    theme_sunset: 'Sunset Orange',
    theme_teal: 'Teal',
    thu: 'Thursday',
    time_range: 'Time Range',
    timestamp: 'Timestamp',
    to: 'to',
    today: 'Today',
    todays_schedule: 'Today\'s Schedule',
    tomorrow: 'Tomorrow',
    total_allowances: 'Total Allowances',
    total_base: 'Total Base',
    total_deductions: 'Total Deductions',
    total_documents: 'Total Documents',
    total_employees: 'Total Employees',
    total_files: 'Total Files',
    total_hours: 'Total Hours',
    total_worked: 'Total Worked',
    total_net: 'Total Net',
    total_paid_ytd: 'Total Paid (YTD)',
    total_runs: 'Total Runs',
    training_certificate: 'Training Certificate',
    trend_action_required: 'Action required',
    trend_high_priority: '2 high priority',
    trend_month: '5 this month',
    trend_pre_employment: '3 pre-employment',
    trend_stable: 'Stable',
    trend_week: '+1 this week',
    tue: 'Tuesday',
    two_factor_auth: 'Two-Factor Authentication',
    two_factor_subtitle: 'Add an extra layer of security to your account',
    type: 'Type',
    types_policies: 'Types & Policies',
    annual_entitlement: 'Annual Entitlement (Days)',
    max_carry_over: 'Max Carry Over (Days)',
    min_notice_days: 'Min Notice (Days)',
    requires_attachment: 'Requires Attachment',
    is_paid: 'Is Paid',
    update_policy: 'Update Policy',
    policy_updated_success: 'Leave policy updated successfully',
    understaffed: 'Understaffed',
    understaffed_shifts: 'Understaffed Shifts',
    unit: 'Unit',
    units: 'Units',
    university_healthcare: 'University of Healthcare',
    unlock_failed: 'Failed to unlock payroll run',
    unlock_run: 'Unlock Run',
    manage_leave_rules: 'Configure rules and entitlements for each leave type.',
    attachment_policy_desc: 'Require medical or official proof for this leave.',
    payment_policy_desc: 'Determine if this leave is fully paid or deducted.',
    paid: 'Paid',
    unpaid: 'Unpaid',
    unpaid_leave_detected: 'Unpaid Leave Detected',
    unsaved_changes: 'Unsaved Changes',
    upcoming_appointments: 'Upcoming Appointments Summary',
    upcoming_events: 'Upcoming Events',
    update_qualification: 'Update Qualification',
    update_status: 'Update Status',
    upload: 'Upload',
    upload_attachment: 'Upload Attachment',
    upload_credentials: 'Upload Credentials',
    upload_credentials_desc: 'Drag and drop files here, or click to browse',
    upload_cv_hint: 'Click to upload or drag and drop',
    upload_date: 'Upload Date',
    upload_document: 'Upload Document',
    upload_file: 'Upload File',
    upload_success: 'Uploaded successfully',
    upload_documents: 'Upload Documents',
    upload_documents_desc: 'Required compliance and identification documents',
    uploading: 'Uploading...',
    uploaded_by: 'Uploaded By',
    applied_date: 'Applied Date',
    attendance_management: 'Attendance Management',
    convert_to_employee: 'Convert to Employee',
    curriculum_vitae: 'Curriculum Vitae',
    department_head: 'Department Head',
    experience: 'Experience',
    experience_years: 'Experience (Years)',
    is_overnight: 'Is Overnight',
    generate_offer: 'Generate Offer',
    job_opening: 'Job Opening',
    legacy_attachment: 'Legacy Attachment',
    no_documents_attached: 'No documents attached',
    resume_cv: 'Resume / CV',
    schedule_interview: 'Schedule Interview',
    scheduling_access: 'Scheduling Access',
    select_position: 'Select Position',
    select_supervisor: 'Select Supervisor',
    select_type: 'Select Type',
    self_service_portal: 'Self Service Portal',
    source: 'Source',
    stage_history: 'Stage History',
    uploaded_documents: 'Uploaded Documents',
    urgent_alerts: 'Urgent Alerts',
    user_list_unavailable: 'User List Unavailable',
    user_list_unavailable_desc: 'The user management interface requires a secure connection to the backend authentication service.',
    user_management_placeholder: 'User Management Placeholder',
    user_management_placeholder_desc: 'This module will interface with the central identity provider (IdP) to manage user accounts, roles, and granular permissions.',
    username_or_email: 'Username or Email',
    users_access: 'Users & Access',
    v2_optional_toggles: 'V2 Optional Toggles',
    vaccination: 'Vaccination',
    vaccination_added_failed: 'Failed to add vaccination',
    vaccination_added_success: 'Vaccination added successfully',
    vaccination_coverage: 'Vaccination Coverage',
    vaccination_details: 'Vaccination Details',
    vaccinations: 'Vaccinations',
    vaccine_name: 'Vaccine Name',
    vaccine_placeholder: 'e.g. Hepatitis B',
    valid: 'Valid',
    value: 'Value',
    verification: 'Verification',
    verification_failed: 'Verification failed',
    verification_queue: 'Verification Queue',
    verification_review: 'Verification Review',
    verification_success: 'Verification successful',
    verify: 'Verify',
    version: 'Version',
    view: 'View',
    view_profile: 'View Profile',
    quick_actions: 'Quick Actions',
    system_health: 'System Health',
    active_users: 'Active Users',
    payroll_cycle: 'Payroll Cycle',
    cutoff_date: 'Cut-off Date',
    calculation_progress: 'Calculation Progress',
    my_department: 'My Department',
    staffing_levels: 'Staffing Levels',
    workforce_health: 'Workforce Health',
    compliance_status: 'Compliance Status',
    audit_logs: 'Audit Logs',
    view_payslip: 'View Payslip',
    system_uptime: 'System Uptime',
    user_activity_trend: 'User Activity Trend',
    recent_hires: 'Recent Hires',
    view_all: 'View All',
    dept_attendance: 'Department Attendance',
    approve_leaves: 'Approve Leaves',
    failed_login_attempts: 'Failed Login Attempts',
    view_details: 'View Details',
    view_draft_sheet: 'View Draft Sheet',
    view_exceptions: 'View Exceptions',
    view_exceptions_only: 'View Exceptions Only',
    view_schedule: 'View Schedule',
    visual_org_chart: 'Visual Org Chart',
    vs_last_month: 'vs last month',
    wed: 'Wednesday',
    week: 'Week',
    weekend_allowance: 'Weekend Allowance',
    weekly_schedule_preview: 'Weekly Schedule Preview',
    welcome_back: 'Welcome back',
    wizard_subtitle: 'Complete the steps below to manage medical credentials.',
    work_information: 'Work Information',
    work_location: 'Work Location',
    workforce_management: 'Workforce Management',
    working_hours_policies: 'Working Hours Policies',
    years: 'Years',
    yes_cancel: 'Yes, cancel',
  },
  ar: {
    senior_manager: 'المدير الأعلى',
    absences: 'الغياب',
    manual_entry_success: 'تم إنشاء سجل الحضور بنجاح.',
    select_employee: 'اختر الموظف',
    check_in_time: 'وقت تسجيل الدخول',
    check_out_time: 'وقت تسجيل الخروج',
    attendance_date: 'تاريخ الحضور',
    manual_attendance_entry: 'إدخال الحضور اليدوي',
    failed_to_save: 'فشل في حفظ السجل.',
    failed_to_delete: 'فشل في حذف العنصر',
    saving: 'جاري الحفظ...',
    team_status_today: 'حالة الفريق اليوم',
    clocked_in: 'تم تسجيل الحضور',
    pending_team_approvals: 'الموافقات المعلقة للفريق',
    no_pending_approvals: 'لا توجد موافقات معلقة لفريقك.',
    view_all_approvals: 'عرض جميع الموافقات',
    hospital_name: 'اسم المستشفى',
    system_logo: 'شعار النظام',
    upload_new: 'رفع جديد',
    default_language: 'اللغة الافتراضية',
    timezone: 'المنطقة الزمنية',
    password_policy: 'سياسة كلمة المرور',
    session_timeout: 'مهلة الجلسة',
    audit_log_details: 'تفاصيل سجل التدقيق',
    activity_details: 'تفاصيل النشاط',
    showing: 'عرض',
    of: 'من',
    entries: 'مدخلات',
    close: 'إغلاق',
    filters: 'تصفية',
    entity: 'الكيان',
    unit_name: 'اسم الوحدة',
    manager: 'المدير',
    employees: 'الموظفون',
    parent_unit: 'الوحدة الأم',
    create_unit: 'إنشاء وحدة',
    hospital_hierarchy: 'التسلسل الهرمي للمستشفى',
    location_management: 'إدارة المواقع',
    unit_management: 'إدارة الوحدات',
    select_role: 'اختر الدور',
    create_user: 'إنشاء مستخدم',
    manage_roles: 'إدارة الأدوار',
    configure_policies: 'تكوين السياسات',
    org_chart_placeholder_desc: 'إدارة الأقسام والوحدات والتسلسل الهرمي للمستشفى. تحديد خطوط التقارير والهيكل التنظيمي.',
    audit_log_placeholder_desc: 'يتم تسجيل نشاط النظام لأغراض الأمن والامتثال. يتم الاحتفاظ بالسجلات لمدة 365 يومًا وفقًا لسياسة المستشفى.',
    audit_policy: 'سياسة التدقيق والاحتفاظ',
    absent: 'غائب',
    access_denied: 'تم رفض الوصول',
    access_denied_desc: 'ليس لديك الإذن للوصول إلى هذه الصفحة.',
    access_policies: 'سياسات الوصول',
    access_policies_desc: 'تحديد القائمة البيضاء لعناوين IP، وإدارة الأجهزة، وسياسات الوصول المشروط.',
    access_restricted_admin_hr: 'الوصول يقتصر على مسؤولي النظام ومديري الموارد البشرية',
    access_roles: 'الوصول والأدوار',
    accountant: 'محاسب',
    action: 'الإجراء',
    action_taken: 'الإجراء المتخذ',
    action_taken_placeholder: 'الإجراءات الفورية المتخذة...',
    actions: 'إجراءات',
    active: 'نشط',
    active_cases: 'الحالات النشطة',
    active_compliance_alerts_found: 'تنبيهات امتثال نشطة تم العثور عليها تتطلب الانتباه.',
    active_system_users: 'مستخدمو النظام النشطون',
    actor: 'الممثل',
    add_component: 'إضافة مكون',
    add_doctor: 'إضافة طبيب',
    add_employee: 'إضافة موظف',
    add_new: 'إضافة جديد',
    add_new_unit: 'إضافة وحدة جديدة',
    system_admin: 'مسؤول النظام',
    hr_manager: 'مدير الموارد البشرية',
    hr_officer: 'موظف الموارد البشرية',
    dept_head: 'رئيس القسم',
    occ_health_officer: 'مسؤول الصحة المهنية',
    it_dept: 'تقنية المعلومات',
    hr_dept: 'الموارد البشرية',
    clinical_dept: 'الخدمات السريرية',
    inactive: 'غير نشط',
    pending: 'قيد الانتظار',
    add_new_user: 'إضافة مستخدم جديد',
    add_payroll_component: 'إضافة مكون راتب',
    add_qualification: 'إضافة {type}',
    add_shift_type: 'إضافة نوع مناوبة',
    add_success: 'تمت الإضافة بنجاح',
    add_vaccination: 'إضافة تطعيم',
    add_vaccination_subtitle: 'تسجيل تطعيم أو جرعة تحصين لموظف.',
    additional_employment_info: 'تتوفر سجلات التوظيف الإضافية ومستندات العقود في علامة تبويب المستندات.',
    additional_specialties: 'تخصصات إضافية',
    address: 'العنوان',
    adjust_filters: 'حاول تعديل الفلاتر أو مصطلحات البحث للعثور على ما تبحث عنه.',
    admin: 'الإدارة',
    admin_only_message: 'هذا القسم متاح لمسؤولي النظام فقط.',
    administration: 'الإدارة',
    agency: 'وكالة',
    all: 'الكل',
    all_caught_up: 'أنت على اطلاع بكل شيء!',
    all_day: 'طوال اليوم',
    all_departments: 'جميع الأقسام',
    all_documents: 'كل المستندات',
    all_employees_compliant: 'جميع الموظفين ممتثلون حالياً للمتطلبات الصحية.',
    all_entities: 'جميع الكيانات',
    all_queue: 'كل القائمة',
    all_rights_reserved: 'جميع الحقوق محفوظة.',
    all_specialties: 'جميع التخصصات',
    all_status: 'جميع الحالات',
    all_statuses: 'جميع الحالات',
    allowance: 'بدل',
    allowances: 'allowances',
    allowances_processed: 'تمت معالجة البدلات',
    am: 'ص',
    american: 'أمريكي',
    annual: 'سنوية',
    annual_leave: 'إجازة سنوية',
    appearance: 'المظهر',
    appearance_subtitle: 'تخصيص مظهر وشعور لوحة التحكم الخاصة بك',
    approval_review: 'مراجعة الموافقة',
    approvals_inbox: 'صندوق الموافقات',
    approve: 'موافقة',
    approve_correction: 'الموافقة على التصحيح',
    approve_correction_confirm: 'هل أنت متأكد أنك تريد الموافقة على طلب التصحيح لـ {{name}} بتاريخ {{date}}؟',
    approve_request: 'الموافقة على الطلب',
    approve_run: 'اعتماد التشغيل',
    approve_success: 'تم اعتماد تشغيل الرواتب بنجاح',
    approved: 'معتمد',
    approved_at: 'تاريخ الاعتماد',
    approved_by: 'اعتمد بواسطة',
    approving: 'جاري الاعتماد...',
    arabic: 'العربية',
    archive: 'أرشفة',
    archived: 'مؤرشف',
    are_you_sure: 'هل أنت متأكد؟',
    assigned: 'تم التعيين',
    assigned_shift: 'المناوبة المعينة',
    assigned_to: 'تم التكليف لـ',
    assignment_details: 'تفاصيل التعيين',
    attachment_hint: 'مطلوب للإجازات المرضية أو الاضطرارية',
    attachments: 'المرفقات',
    attendance: 'الحضور',
    attendance_imported: 'تم استيراد بيانات الحضور',
    attendance_imported_success: 'تم استيراد بيانات الحضور بنجاح',
    attendance_log: 'سجل الحضور',
    attendance_export_success: 'تم تصدير سجل الحضور بنجاح',
    attendance_manual_entry_hint: 'ميزة إدخال الحضور اليدوي ستتوفر قريباً.',
    attendance_monthly_summary: 'ملخص الحضور الشهري',
    attendance_mgmt: 'إدارة الحضور',
    attendance_reminders: 'تذكيرات الحضور',
    attendance_subtitle: 'تتبع الحضور اليومي، وإدارة التصحيحات، ومراقبة العمل الإضافي.',
    attendance_trend: 'اتجاه الحضور (أسبوعي)',
    audit_log_policy_msg: '* سجلات التدقيق غير قابلة للتغيير ويتم الاحتفاظ بها لمدة 7 سنوات وفقاً لسياسة الامتثال.',
    availability: 'التوفر',
    availability_status: 'حالة التوفر',
    available: 'متاح',
    avg_monthly_net: 'متوسط الصافي الشهري',
    back: 'رجوع',
    base_salary: 'الراتب الأساسي',
    basic_details: 'التفاصيل الأساسية',
    basic_info: 'المعلومات الأساسية',
    board_certification: 'شهادة البورد',
    bs_nursing: 'بكالوريوس العلوم في التمريض',
    bulk_generate: 'إنشاء جماعي',
    bulk_generate_success: 'تم اكتمال الإنشاء الجماعي بنجاح',
    bulk_generating_msg: 'جاري إنشاء {count} قسيمة راتب...',
    busy: 'مشغول',
    calc_failed: 'فشل في حساب الرواتب',
    calc_method: 'طريقة الحساب',
    calc_success: 'تم اكتمال حساب الرواتب بنجاح',
    calculate_payroll: 'حساب الرواتب',
    calculated: 'محسوب',
    calculating: 'جاري الحساب...',
    cancel: 'إلغاء',
    cancel_confirm_msg: 'هل أنت متأكد أنك تريد الإلغاء؟ سيتم فقدان جميع المعلومات المدخلة.',
    candidates: 'المرشحون',
    cardiology: 'أمراض القلب',
    case_closed_success: 'تم إغلاق حالة الحادث',
    category: 'الفئة',
    cert_training: 'الشهادات والتدريب',
    change: 'تغيير',
    change_candidate: 'تغيير المرشح',
    change_password: 'تغيير كلمة المرور',
    check_in: 'تسجيل الدخول',
    check_in_out: 'تسجيل الحضور / الانصراف',
    check_in_success: 'تم تسجيل الدخول بنجاح. نتمنى لك مناوبة سعيدة!',
    check_in_success_late: 'تم تسجيل الدخول بنجاح. ملاحظة: تم تسجيلك كمتأخر.',
    check_out: 'تسجيل الخروج',
    check_out_success: 'تم تسجيل الخروج بنجاح. نراك غداً!',
    checked_in: 'تم تسجيل الدخول',
    checked_out: 'تم تسجيل الخروج',
    checkup_details: 'تفاصيل الفحص',
    checkup_scheduled_failed: 'فشل جدولة الفحص',
    checkup_scheduled_success: 'تم جدولة الفحص الطبي بنجاح',
    choose_columns: 'اختيار الأعمدة',
    click_to_upload: 'انقر للرفع أو قم بالسحب والإفلات',
    clock_in: 'تسجيل الحضور',
    close_case: 'إغلاق الحالة',
    closed_date: 'تاريخ الإغلاق',
    closure_note: 'ملاحظة الإغلاق',
    closure_note_placeholder: 'قدم سبباً لإغلاق هذه الحالة...',
    code: 'الرمز',
    collapse_menu: 'طوي القائمة',
    comment_placeholder: 'أضف تعليقاً للسجل...',
    compassionate: 'عزاء',
    complete_onboarding: 'إتمام الإضافة',
    completed: 'مكتمل',
    completed_annual_training: 'أكمل التدريب السنوي',
    compliance_access: 'وصول للامتثال',
    compliance_alerts: 'تنبيهات الامتثال',
    compliance_documents: 'الامتثال والوثائق',
    compliance_rate: 'معدل الامتثال',
    contract: 'عقد',
    compliance_subtitle: 'إدارة التراخيص المهنية، والشهادات، وتخزين المستندات الموحد.',
    compliance_training_desc: 'تم إكمال التدريب الإلزامي على الامتثال والسلامة في {date}',
    component_added_success: 'تم إضافة مكون الرواتب بنجاح',
    component_name: 'اسم المكون',
    components: 'المكونات',
    confidential_findings: 'نتائج سرية',
    confidential_notes: 'ملاحظات سرية',
    confidential_notes_placeholder: 'ملاحظات سرية لمسؤول الصحة المهنية فقط...',
    confirm: 'تأكيد',
    confirm_cancel: 'تأكيد الإلغاء',
    confirm_close_case: 'تأكيد وإغلاق الحالة',
    confirm_deactivation: 'تأكيد إلغاء التفعيل',
    confirm_logout: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
    confirm_new_password: 'تأكيد كلمة المرور الجديدة',
    confirm_reject: 'تأكيد الرفض',
    confirm_rejection: 'تأكيد الرفض',
    confirmed: 'مؤكد',
    conflicts_detected: 'تم اكتشاف تعارضات',
    consultation: 'استشارة',
    contact_details: 'تفاصيل الاتصال',
    contact_during_leave: 'جهة الاتصال أثناء الإجازة',
    contact_information: 'معلومات الاتصال',
    contact_placeholder: 'رقم الهاتف أو جهة اتصال للطوارئ',
    continue: 'استمرار',
    contract_agreement: 'اتفاقية العقد',
    contract_information: 'معلومات العقد',
    contract_type: 'نوع العقد',
    core_data: 'البيانات الأساسية',
    correction_reason_placeholder: 'اشرح سبب الحاجة للتصحيح...',
    correction_request_details: 'تفاصيل طلب التصحيح',
    correction_requests: 'طلبات التصحيح',
    coverage_analysis: 'تحليل التغطية',
    create_feb_run: 'إنشاء تشغيل فبراير',
    create_new_employee: 'إنشاء موظف جديد',
    create_new_run: 'إنشاء تشغيل جديد',
    create_policy: 'إنشاء سياسة',
    create_system_login: 'إنشاء حساب دخول للنظام',
    credentials_documents: 'الاعتمادات والمستندات',
    critical: 'حرج',
    current_duration: 'المدة الحالية',
    current_password: 'كلمة المرور الحالية',
    current_run_status: 'حالة التشغيل الحالي',
    current_stage: 'المرحلة الحالية',
    current_status: 'الحالة الحالية',
    current_system_time: 'وقت النظام الحالي',
    cv_format_hint: 'PDF, DOCX حتى 10 ميجابايت',
    dashboard: 'لوحة القيادة',
    dashboard_subtitle: 'مراقبة عمليات المستشفى ومقاييس الموارد البشرية.',
    data_management: 'إدارة البيانات',
    data_management_desc: 'جداول النسخ الاحتياطي، وسياسات الاحتفاظ بالبيانات، وأدوات التصدير والاستيراد.',
    date: 'التاريخ',
    date_of_birth: 'تاريخ الميلاد',
    day: 'يوم',
    day_shift: 'مناوبة نهارية',
    deactivate: 'إلغاء التنشيط',
    deactivate_confirm_message: 'سيؤدي هذا إلى وضع علامة على سجل الطبيب كغير نشط.',
    deactivate_confirm_question: 'هل أنت متأكد أنك تريد إلغاء تفعيل',
    deactivate_doctor: 'إلغاء تفعيل الطبيب',
    deactivate_reason: 'سبب إلغاء التفعيل',
    deactivation_started: 'بدأت عملية إلغاء تفعيل {code}.',
    deduction: 'استقطاع',
    deductions: 'deductions',
    delete: 'حذف',
    department: 'القسم',
    departments: 'الأقسام',
    dept_distribution: 'توزيع الأقسام',
    dept_placeholder: 'مثال: التمريض',
    dermatology: 'أمراض الجلدية',
    description: 'الوصف',
    description_placeholder: 'مثال: مسؤول عن رعاية المرضى في وحدة العناية المركزة...',
    details: 'التفاصيل',
    display_columns: 'عرض الأعمدة',
    dob: 'تاريخ الميلاد',
    doc: 'مستند',
    doc_national_id: 'الهوية الوطنية / جواز السفر',
    doc_preview_placeholder: 'مكان معاينة المستند',
    doc_professional_license: 'الرخصة المهنية',
    doctor: 'طبيب',
    doctor_code: 'كود الطبيب',
    doctor_onboarded: 'تمت إضافة {code} بنجاح.',
    doctor_updated: 'تم تحديث بيانات {code}.',
    doctors: 'الأطباء',
    doctors_subtitle: 'إدارة بيانات الأطباء، والتخصصات، والحالة السريرية.',
    document_center: 'مركز المستندات',
    document_deleted_success: 'تم حذف المستند بنجاح',
    document_name: 'اسم المستند',
    document_preview: 'معاينة المستند',
    documents: 'المستندات',
    dose: 'الجرعة',
    download: 'تحميل',
    download_all: 'تحميل الكل',
    download_pdf: 'تنزيل PDF',
    download_report: 'تنزيل التقرير',
    draft: 'مسودة',
    draft_mode: 'وضع المسودة',
    draft_saving_soon: 'سيتم توفير ميزة حفظ المسودة قريباً.',
    due_date: 'تاريخ الاستحقاق',
    duration: 'المدة',
    duration_hours: 'المدة (ساعات)',
    edit: 'تعديل',
    edit_details: 'تعديل التفاصيل',
    edit_doctor: 'تعديل بيانات الطبيب',
    edit_permissions: 'تعديل الأذونات',
    education: 'التعليم',
    eg_travel_allowance: 'مثلاً: بدل سفر',
    email: 'البريد الإلكتروني',
    email_address: 'البريد الإلكتروني',
    email_notifications: 'تنبيهات البريد الإلكتروني',
    email_notifications_desc: 'تلقي التحديثات عبر البريد الإلكتروني',
    email_placeholder: 'مثال: john@example.com',
    emergency: 'الطوارئ',
    emergency_contact: 'جهة اتصال الطوارئ',
    emergency_medicine: 'طب الطوارئ',
    emp_id_placeholder: 'مثال: EMP-001',
    employee: 'موظف',
    employee_added_success: 'تم إضافة الموظف بنجاح',
    employee_data_exported: 'تم تصدير بيانات الموظف بنجاح',
    employee_details: 'تفاصيل الموظف',
    employee_id: 'رقم الموظف',
    employee_name: 'اسم الموظف',
    employee_no: 'رقم الموظف',
    employee_profile: 'ملف الموظف',
    employee_reviews: 'مراجعات الموظفين',
    employees_subtitle: 'إدارة طاقم المستشفى وسجلاتهم.',
    employment_details: 'تفاصيل التوظيف',
    enable_2fa: 'تفعيل المصادقة الثنائية',
    enable_extra_pay_night: 'تفعيل دفع إضافي للورديات الليلية',
    enable_extra_pay_weekend: 'تفعيل دفع إضافي لورديات عطلة نهاية الأسبوع',
    enable_pay_on_call: 'تفعيل الدفع لمهام الاستدعاء',
    end_date: 'تاريخ الانتهاء',
    end_date_after_start: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء',
    end_date_required: 'تاريخ الانتهاء مطلوب',
    english: 'الإنجليزية',
    end_time: 'وقت الانتهاء',
    entity_id: 'معرف الكيان',
    entity_type: 'نوع الكيان',
    error_creating_template: 'خطأ في إنشاء النموذج',
    error_fetching_analytics: 'خطأ في جلب التحليلات',
    error_updating_status: 'خطأ في تحديث الحالة',
    eval_cycles: 'دورات التقييم',
    eval_templates: 'نماذج التقييم',
    evening_shift: 'المناوبة المسائية',
    exception_summary: 'ملخص الاستثناءات',
    exceptions_found: 'الاستثناءات الموجودة',
    exit: 'خروج',
    expand_menu: 'توسيع القائمة',
    experience_placeholder: 'مثال: 5',
    expired: 'منتهي',
    expires_in_days: 'تنتهي خلال {days} أيام',
    expiring: 'تنتهي قريباً',
    expiring_docs: 'وثائق منتهية',
    expiring_soon: 'ينتهي قريباً',
    expiring_this_week: 'تنتهي صلاحيتها هذا الأسبوع',
    expiry_date: 'تاريخ الانتهاء',
    export: 'تصدير',
    export_csv: 'تصدير CSV',
    export_expiry_list: 'تصدير قائمة الانتهاء',
    export_history: 'تصدير السجل',
    export_org_chart: 'تصدير الهيكل التنظيمي',
    export_pdf: 'تصدير PDF',
    export_sheet: 'تصدير الكشف',
    exposure: 'تعرض',
    extreme_values: 'قيم متطرفة',
    failed: 'فشل',
    failed_fetch_data: 'فشل في جلب البيانات',
    failed_fetch_history: 'فشل في جلب سجل الرواتب',
    failed_fetch_reviews: 'فشل في جلب مراجعات الرواتب',
    missing_checkouts: 'تسجيلات خروج مفقودة',
    feature_coming_soon: 'هذه الميزة ستتوفر قريباً',
    hours: 'ساعات',
    hours_short: 'ساعة',
    minutes: 'دقائق',
    minutes_short: 'دقيقة',
    send_to_payroll: 'إرسال إلى الرواتب',
    february_2024: 'فبراير 2024',
    feedback_placeholder: 'ملاحظات مفصلة...',
    female: 'أنثى',
    field_required: 'هذا الحقل مطلوب',
    file_name: 'اسم الملف',
    filter: 'تصفية',
    filter_by_type: 'تصفية حسب النوع',
    filter_by_dept: 'تصفية حسب القسم',
    apply_filters: 'تطبيق الفلاتر',
    filters_applied_successfully: 'تم تطبيق الفلاتر بنجاح',
    reset_filters: 'إعادة تعيين',
    finance: 'المالية',
    first_name: 'الاسم الأول',
    first_name_placeholder: 'مثال: أحمد',
    fixed: 'ثابت',
    flags: 'تنبيهات',
    follow_up: 'متابعة',
    follow_up_completed_success: 'تم تحديد مهمة المتابعة كمكتملة',
    follow_up_details: 'تفاصيل المتابعة',
    follow_ups: 'المتابعات',
    forgot_password: 'هل نسيت كلمة المرور؟',
    reset_password_title: 'إعادة تعيين كلمة المرور',
    reset_password_subtitle: 'أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين',
    send_reset_link: 'إرسال رابط الإعادة',
    back_to_login: 'العودة لتسجيل الدخول',
    reset_link_sent: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.',
    formula: 'معادلة',
    fri: 'الجمعة',
    full_access: 'وصول كامل',
    full_calendar_view: 'عرض التقويم الكامل',
    full_name: 'الاسم الكامل',
    full_name_placeholder: 'مثال: جون دو',
    full_time: 'دوام كامل',
    future_backend_integration_required: 'تكامل الواجهة الخلفية مطلوب مستقبلاً',
    gender: 'الجنس',
    general_settings: 'الإعدادات العامة',
    general_settings_desc: 'تكوين اسم المستشفى، والعلامة التجارية، والترجمة، والمنطقة الزمنية الافتراضية.',
    admin_console: 'لوحة التحكم الإدارية',
    admin_subtitle: 'تكوين إعدادات النظام، وإدارة وصول المستخدمين، وتحديد الهيكل التنظيمي، ومراقبة نشاط النظام.',
    audit_log: 'سجل التدقيق والنشاط',
    branding_settings: 'إعدادات العلامة التجارية',
    edit_unit: 'تعديل الوحدة',
    edit_user: 'تعديل المستخدم',
    localization_settings: 'إعدادات التوطين',
    notification_settings: 'إعدادات التنبيهات',
    org_management: 'إدارة المؤسسة',
    privacy_settings: 'إعدادات الخصوصية',
    role_permissions: 'صلاحيات الأدوار',
    rbac_active_desc: 'نظام الصلاحيات حسب الدور مفعّل. يتم تصفية الصفحات والإجراءات حسب الدور ونطاق البيانات.',
    role_scope: 'نطاق البيانات',
    access_level: 'مستوى الوصول',
    organization_scope: 'على مستوى المؤسسة',
    department_scope: 'القسم الخاص',
    own_records: 'السجلات الشخصية فقط',
    modules_count: 'وحدات',
    save_settings_success: 'تم حفظ الإعدادات بنجاح',
    security_settings: 'الإعدادات الأمنية',
    system_configuration: 'تكوين النظام',
    unit_created_success: 'تم إنشاء الوحدة بنجاح',
    unit_details: 'تفاصيل الوحدة',
    user_created_success: 'تم إنشاء المستخدم بنجاح',
    user_details: 'تفاصيل المستخدم',
    user_management: 'إدارة المستخدمين',
    users: 'المستخدمون',
    user: 'المستخدم',
    january_2024: 'يناير 2024',
    march_2024: 'مارس 2024',
    general_surgery: 'الجراحة العامة',
    generate_report: 'إنشاء تقرير',
    generated_at: 'تم الإنشاء في',
    generated_reports: 'التقارير المنشأة',
    global: 'عام',
    go_back: 'العودة',
    go_home: 'الرئيسية',
    head_nurse: 'رئيس ممرضين',
    headcount: 'عدد الموظفين',
    operational_overview: 'نظرة تشغيلية',
    system_status: 'حالة النظام',
    active_employees: 'الموظفون النشطون',
    open_positions: 'الشواغر المفتوحة',
    department_distribution: 'الحضور حسب القسم',
    team_status: 'حالة الفريق',
    recruitment_funnel: 'مسار المرشحين حسب المرحلة',
    on_duty: 'على رأس العمل',
    present: 'حاضر',
    exceptions: 'استثناءات',
    no_data: 'لا توجد بيانات',
    health: 'الصحة المهنية',
    health_certificate: 'الشهادة الصحية',
    health_subtitle: 'إدارة سلامة مكان العمل، والسجلات الصحية للموظفين، والامتثال الطبي.',
    high: 'عالي',
    hire_date: 'تاريخ التعيين',
    hospital_anniversary: 'ذكرى تأسيس المستشفى',
    hospital_mgmt_system: 'نظام إدارة موارد المستشفى',
    hr: 'الموارد البشرية',
    hr_manager_only: 'لمدير الموارد البشرية فقط',
    hr_view: 'عرض الموارد البشرية',
    human_resources: 'الموارد البشرية',
    id: 'المعرف',
    identification: 'الهوية',
    illness: 'مرض',
    import_attendance: 'استيراد الحضور',
    incident_description_placeholder: 'صف الحادث بالتفصيل...',
    incident_details: 'تفاصيل الحادث',
    incident_reported_failed: 'فشل الإبلاغ عن الحادث',
    incident_reported_success: 'تم الإبلاغ عن الحادث بنجاح',
    incidents: 'الحوادث',
    injury: 'إصابة',
    internal_comments: 'تعليقات داخلية',
    internal_medicine: 'الباطنة العامة',
    interviewers_placeholder: 'مثال: د. هاوس، نيرس جوي',
    interviews: 'المقابلات',
    invalid_email: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    issue: 'المشكلة',
    issue_date: 'تاريخ الإصدار',
    issuing_authority: 'جهة الإصدار',
    it: 'تكنولوجيا المعلومات',
    job_assignment: 'الوظيفة والتعيين',
    job_openings: 'الوظائف الشاغرة',
    job_title_placeholder: 'مثال: ممرض مسجل أول',
    laboratory: 'المختبر',
    language: 'اللغة',
    last_name: 'اسم العائلة',
    last_name_placeholder: 'مثال: محمد',
    last_review: 'آخر مراجعة',
    late: 'متأخر',
    late_min: 'التأخير (دقيقة)',
    late_penalty_applied: 'تم تطبيق غرامة تأخير',
    late_unpaid: 'التأخير وغير المدفوع',
    latest_payslip_summary: 'ملخص أحدث قسيمة راتب',
    leave_balances: 'أرصدة الإجازات',
    leave_calendar: 'تقويم الإجازات',
    leave_deductions_applied: 'تم تطبيق خصومات الإجازات',
    leave_mgmt: 'إدارة الإجازات',
    leave_overlap: 'تداخل الإجازات',
    leave_reason_placeholder: 'يرجى تقديم سبب مفصل لطلب الإجازة...',
    leave_request_approved: 'تمت الموافقة على طلب الإجازة',
    leave_requests: 'طلبات الإجازات',
    leave_request_details: 'تفاصيل طلب الإجازة',
    my_requests: 'طلباتي',
    team_requests: 'طلبات الفريق',
    all_requests: 'جميع الطلبات',
    search_leave_placeholder: 'البحث بالاسم، الرقم الوظيفي، أو نوع الإجازة...',
    new_leave_request: 'طلب إجازة جديد',
    stage_status: 'المرحلة/الحالة',
    reject_request: 'رفض الطلب',
    currently_at: 'حالياً في',
    scheduling_block_hint: 'سيقوم نظام الجدولة بحظر المناوبات لهذه التواريخ تلقائياً.',
    approval_history: 'سجل الموافقات',
    dept_manager_approval: 'موافقة مدير القسم',
    hr_final_approval: 'موافقة الموارد البشرية النهائية',
    approved_by_on: 'تمت الموافقة من قبل {{name}} في {{date}}',
    rejected_at_stage: 'تم الرفض في هذه المرحلة',
    pending_review: 'قيد المراجعة',
    days: 'أيام',
    request_details: 'تفاصيل الطلب',
    on: 'في',
    leave_subtitle: 'تتبع واعتماد وإدارة طلبات إجازات الموظفين وأرصدتهم.',
    leave_type: 'نوع الإجازة',
    leave_type_required: 'نوع الإجازة مطلوب',
    leaves: 'الإجازات',
    license_credentials: 'التراخيص والاعتمادات',
    license_expiry: 'انتهاء الترخيص',
    license_name: 'اسم الترخيص',
    license_number: 'رقم الترخيص',
    license_placeholder: 'ABC-12345678',
    license_status: 'حالة الترخيص',
    licenses: 'التراخيص',
    licensing_authority: 'جهة الترخيص',
    link_candidate: 'ربط من التوظيف',
    link_candidate_desc: 'استيراد البيانات من مرشح توظيف ناجح.',
    link_employee: 'ربط موظف',
    link_existing_employee: 'ربط موظف حالي',
    linked_to: 'مرتبط بـ',
    loading: 'جاري التحميل...',
    loading_candidates: 'جاري تحميل المرشحين...',
    loading_data: 'جاري تحميل البيانات...',
    location: 'الموقع',
    location_placeholder: 'مثال: القاعة الرئيسية، الطابق 2',
    lock_failed: 'فشل في قفل تشغيل الرواتب',
    lock_run: 'قفل التشغيل',
    locked: 'مقفل',
    login_error_empty: 'يرجى إدخال كل من اسم المستخدم/البريد الإلكتروني وكلمة المرور.',
    logout: 'تسجيل الخروج',
    low: 'منخفض',
    main_hospital: 'المستشفى الرئيسي',
    maintenance: 'الصيانة',
    male: 'ذكر',
    manage_data: 'إدارة البيانات',
    manage_notifications: 'إدارة الإشعارات',
    manage_privacy: 'إدارة الخصوصية',
    manage_security: 'إدارة الأمن',
    manage_settings: 'إدارة الإعدادات',
    manual_entry: 'إدخال يدوي',
    manual_entry_desc: 'ابدأ من الصفر وأدخل جميع التفاصيل يدويًا.',
    march: 'مارس',
    mark_all_seen: 'تحديد الكل كمقروء',
    mark_as_seen: 'تحديد كمقروء',
    mark_completed: 'تحديد كمكتمل',
    mark_renewed: 'تحديد كمجدد',
    marketing_emails: 'رسائل البريد الإلكتروني التسويقية',
    marketing_emails_desc: 'أخبار حول الميزات والتحديثات',
    maternity: 'أمومة',
    max_hours_day: 'أقصى ساعات/يوم',
    max_hours_week: 'أقصى ساعات/أسبوع',
    max_ot: 'أقصى عمل إضافي',
    medical: 'طبي',
    medical_checkup: 'فحص طبي',
    medical_checkups: 'الفحوصات الطبية',
    medical_license_details: 'تفاصيل الترخيص الطبي',
    medical_license_no: 'رقم الترخيص الطبي',
    medical_license_placeholder: 'مثال: ML-12345',
    medical_license_scan: 'نسخة ترخيص مزاولة المهنة',
    medical_staff: 'الطاقم الطبي',
    medistaff_hr: 'أوريكس ستاف',
    missing_co: 'تسجيل خروج مفقود',
    medium: 'متوسط',
    min_staff: 'الحد الأدنى للموظفين',
    missing: 'مفقود',
    missing_attendance: 'الحضور مفقود',
    missing_checkout: 'تسجيل خروج مفقود',
    missing_salary: 'معلومات الراتب مفقودة',
    mock_address: 'طريق الملك فهد، الرياض، المملكة العربية السعودية',
    mock_dob: '12 مايو 1988',
    mock_emergency_contact_name: 'جون دو',
    mock_emergency_contact_relation: 'الزوج/الزوجة',
    mock_employee_id: 'EMP-2024-001',
    mock_hire_date: '15 يناير 2024',
    mock_phone: '+966 50 123 4567',
    mock_supervisor: 'د. سارة ميتشل',
    mon: 'الاثنين',
    month: 'شهر',
    morning_shift: 'المناوبة الصباحية',
    ms_nursing: 'ماجستير العلوم في التمريض',
    multiplier: 'مضاعف',
    my_attendance_rate: 'معدل حضوري',
    my_payslips: 'قسائمي',
    my_recent_activity: 'نشاطي الأخير',
    name: 'الاسم',
    national_id: 'الهوية الوطنية',
    national_id_ssn: 'الرقم القومي / رقم الضمان الاجتماعي',
    nationality: 'الجنسية',
    nationality_placeholder: 'مثال: أمريكي',
    near_miss: 'وشيك الوقوع',
    negative_net: 'صافي راتب سلبي',
    net_payable: 'صافي المبلغ المستحق',
    net_payroll: 'صافي الرواتب',
    net_salary: 'صافي الراتب',
    neurology: 'أمراض المخ والأعصاب',
    new_custom_report: 'تقرير مخصص جديد',
    new_document_optional: 'مستند جديد (اختياري)',
    new_expiry_date: 'تاريخ انتهاء جديد',
    new_password: 'كلمة المرور الجديدة',
    new_request: 'طلب جديد',
    next: 'التالي',
    next_checkup_date: 'تاريخ الفحص القادم',
    next_review: 'المراجعة القادمة',
    next_shift: 'المناوبة القادمة',
    next_step_payroll_review: 'الخطوة التالية: مراجعة الرواتب',
    night_shift: 'المناوبة الليلية',
    night_shift_allowance: 'بدل وردية ليلية',
    no_actions_recorded: 'لم يتم تسجيل أي إجراءات بعد.',
    no_active_payroll_run: 'لا يوجد تشغيل رواتب نشط',
    no_alerts_found: 'لا توجد تنبيهات',
    no_expiring_docs: 'لا توجد مستندات منتهية الصلاحية',
    no_recent_hires: 'لا توجد تعيينات حديثة',
    no_one_on_leave: 'لا يوجد أحد في إجازة اليوم',
    no_attachments_provided: 'لا توجد مرفقات',
    no_candidates_found: 'لم يتم العثور على مرشحين.',
    no_compliance_alerts: 'لا توجد تنبيهات امتثال',
    no_data_available: 'لا تتوفر بيانات',
    no_eligible_employees: 'لم يتم العثور على موظفين مؤهلين. تأكد من أنهم نشطون وليسوا أطباء بالفعل.',
    no_keep_editing: 'لا، استمر في التعديل',
    no_recent_activity: 'لا يوجد نشاط مؤخراً',
    no_records_found: 'لم يتم العثور على سجلات.',
    no_shift_scheduled: 'لا توجد مناوبة مجدولة',
    no_swap_requests: 'لم يتم العثور على طلبات تبديل نشطة.',
    not_available: 'غير متاح',
    note: 'ملاحظة',
    notes: 'ملاحظات',
    notes_placeholder: 'معلومات إضافية...',
    notifications: 'الإشعارات',
    notifications_desc: 'تكوين خادم البريد الإلكتروني (SMTP) وقواعد دفع الإشعارات على مستوى النظام.',
    notifications_subtitle: 'التحكم في كيفية ووقت تلقي التحديثات',
    number: 'الرقم',
    nurse: 'ممرض',
    nursing: 'التمريض',
    nursing_license: 'رخصة التمريض',
    occupational_health: 'الصحة المهنية',
    off: 'إجازة',
    offers: 'العروض',
    oho: 'موظف الصحة المهنية',
    oho_only: 'للمسؤول الصحي فقط',
    ok: 'موافق',
    on_call: 'تحت الطلب',
    on_call_allowance: 'بدل الاستدعاء',
    on_call_status: 'حالة الاستدعاء',
    on_leave: 'في إجازة',
    on_leave_today: 'من في إجازة اليوم',
    onboard_doctor: 'إضافة طبيب جديد',
    onboarding_path: 'مسار التعيين',
    onboarding_path_desc: 'اختر كيف تريد بدء عملية التعيين',
    once_locked_review: 'بمجرد قفل التشغيل، سيكون متاحًا للمراجعة التفصيلية والاعتماد من قبل مسؤول الرواتب أو مدير الموارد البشرية.',
    open_fullscreen: 'فتح بملء الشاشة',
    operations: 'العمليات',
    optional: 'اختياري',
    org_chart_engine_offline: 'محرك الهيكل التنظيمي غير متصل',
    org_chart_engine_offline_desc: 'يتطلب محرك تصور الهيكل التنظيمي اتصالاً مباشراً بقاعدة بيانات القوى العاملة لتعيين هياكل التقارير والتسلسلات الهرمية للأقسام.',
    org_chart_placeholder: 'مكان الهيكل التنظيمي',
    org_structure: 'الهيكل التنظيمي',
    organization: 'المنظمة',
    orthopedics: 'جراحة العظام',
    other: 'آخر',
    other_document: 'أخرى',
    overall_coverage: 'التغطية العامة',
    overall_rating: 'التقييم العام',
    overtime: 'العمل الإضافي',
    overtime_allowed: 'يسمح بالعمل الإضافي',
    overtime_calculated: 'تم حساب العمل الإضافي',
    overtime_late_summary: 'ملخص العمل الإضافي والتأخير',
    overview: 'نظرة عامة',
    passport_expiry: 'تاريخ انتهاء جواز السفر',
    passport_number: 'رقم جواز السفر',
    password: 'كلمة المرور',
    password_recovery_demo: 'استعادة كلمة المرور غير مفعلة في هذا العرض التجريبي.',
    password_too_short: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
    passwords_dont_match: 'كلمات المرور غير متطابقة',
    paternity: 'أبوة',
    patient: 'مريض',
    patient_no: 'مريض #{no}',
    payroll: 'كشوف المرتبات',
    payroll_history: 'سجل الرواتب',
    payroll_history_desc: 'عرض ومراجعة عمليات تشغيل الرواتب السابقة واعتماداتها.',
    payroll_history_subtitle: 'عرض عمليات تشغيل الرواتب السابقة وتنزيل التقارير التاريخية.',
    payroll_mgmt: 'إدارة الرواتب',
    payroll_officer: 'موظف الرواتب',
    payroll_report: 'تقرير الرواتب',
    payroll_review: 'مراجعة الرواتب',
    payroll_review_subtitle: 'مراجعة حسابات رواتب الموظفين واعتماد التشغيل.',
    payroll_settings: 'إعدادات الرواتب',
    payroll_settings_subtitle: 'تكوين مكونات الراتب والقواعد وطرق الحساب.',
    payroll_status: 'حالة الرواتب',
    payroll_subtitle: 'إدارة مكونات الراتب، ومعالجة الرواتب، وعرض قسائم الراتب.',
    payroll_summary: 'ملخص الرواتب',
    payslip: 'قسيمة الراتب',
    payslip_available: 'قسيمة الراتب متاحة',
    payslip_download_success: 'تم تنزيل قسيمة الراتب بنجاح',
    payslips: 'قسائم الراتب',
    payslips_subtitle: 'عرض وتنزيل قسائم الرواتب الشهرية.',
    pediatrics: 'طب الأطفال',
    peer: 'زميل',
    pending_checkups: 'الفحوصات المعلقة',
    pending_followups: 'المتابعات المعلقة',
    pending_leaves: 'إجازات معلقة',
    pending_queue: 'قيد الانتظار',
    pending_requests: 'الطلبات المعلقة',
    pending_verification: 'قيد التحقق',
    people: 'الأشخاص',
    percentage: 'نسبة مئوية',
    performance: 'الأداء',
    performance_active_participants: 'المشاركون النشطون',
    performance_all_employees: 'جميع الموظفين',
    performance_all_fields_required: 'جميع الحقول مطلوبة',
    performance_analytics_subtitle: 'رؤى بصرية حول اتجاهات الأداء على مستوى المؤسسة.',
    performance_analytics_title: 'تحليلات الأداء',
    performance_assign_evaluators: 'تعيين المقيمين',
    performance_assign_evaluators_desc: 'تجاوز تعيينات المدير الافتراضية لموظفين محددين.',
    performance_avg_org_score: 'متوسط درجة المؤسسة',
    performance_communication: 'التواصل',
    performance_competency_ratings: 'تقييمات الكفاءة',
    performance_complete_review: 'إكمال المراجعة',
    performance_completion: 'الإكمال',
    performance_completion_rate: 'معدل الإكمال',
    performance_create_new_template: 'إنشاء نموذج جديد',
    performance_create_template: 'إنشاء نموذج',
    performance_created_at: 'تاريخ الإنشاء',
    performance_created_by: 'أنشئ بواسطة',
    performance_cycle_active: 'تم تفعيل الدورة بنجاح',
    performance_cycle_closed: 'تم إغلاق الدورة بنجاح',
    performance_cycle_created: 'تم إنشاء دورة تقييم جديدة كمسودة',
    performance_cycle_finalized: 'تم اعتماد النتائج بنجاح',
    performance_cycle_name: 'اسم الدورة',
    performance_cycle_note: 'بدء الدورة سيخطر جميع المشاركين ومديريهم. بشكل افتراضي، يتم تعيين المديرين المباشرين كمقيمين.',
    performance_cycle_placeholder: 'مثال: مراجعة منتصف عام 2024',
    performance_cycle_progress: 'تقدم إكمال الدورة',
    performance_cycle_status_updated: 'تم تحديث حالة الدورة إلى {{status}}',
    performance_cycles_subtitle: 'إطلاق ومراقبة فترات مراجعة الأداء.',
    performance_cycles_title: 'دورات التقييم',
    performance_dept_averages: 'متوسطات الأقسام',
    performance_development_plan: 'خطة التطوير',
    performance_discipline: 'الانضباط',
    performance_draft_saved: 'تم حفظ مسودة تقييم الأداء بنجاح',
    performance_draft_saved_success: 'تم حفظ المسودة بنجاح',
    performance_due_date: 'تاريخ الاستحقاق',
    performance_edit_template: 'تعديل النموذج',
    performance_employee: 'الموظف',
    performance_evaluator: 'المقيم',
    performance_evaluator_name: 'المقيم',
    performance_failed_load_reviews: 'فشل تحميل بيانات المراجعات',
    performance_failed_submit: 'فشل إرسال المراجعة',
    performance_failed_submit_review: 'فشل إرسال المراجعة',
    performance_final_assessment: 'التقييم النهائي',
    performance_finalize_confirmation_text: 'أنت على وشك اعتماد مراجعة الأداء هذه. بمجرد الإرسال، لا يمكن تعديلها.',
    performance_finalize_results: 'نهائي النتائج',
    performance_fixed_sections: 'الأقسام الثابتة',
    performance_manager_comments: 'تعليقات المدير',
    performance_mgmt: 'إدارة الأداء',
    performance_my_pending_reviews: 'مراجعاتي المعلقة',
    performance_my_received_reviews: 'مراجعاتي المستلمة',
    performance_overall_score: 'الدرجة الكلية',
    performance_period: 'الفترة',
    performance_period_type: 'نوع الفترة',
    performance_rating_placeholder: 'تعليقات لـ {label}...',
    performance_review_details: 'تفاصيل المراجعة',
    performance_review_submitted: 'تم إرسال المراجعة بنجاح',
    performance_reviews_subtitle: 'تتبع وإكمال تقييمات أداء الموظفين.',
    performance_reviews_title: 'مراجعات الأداء',
    performance_save_assignments: 'حفظ التعيينات',
    performance_save_draft: 'حفظ كمسودة',
    performance_scope: 'النطاق',
    performance_score_distribution: 'توزيع الدرجات',
    performance_specific_dept: 'قسم محدد',
    performance_start_cycle: 'بدء الدورة',
    performance_start_new_cycle: 'بدء دورة تقييم جديدة',
    performance_submit_confirmation_text: 'أنت على وشك اعتماد مراجعة الأداء هذه. بمجرد الإرسال، لا يمكن تعديلها.',
    performance_submit_review: 'إرسال المراجعة',
    performance_subtitle: 'إدارة نماذج التقييم، والدورات، ومراجعات أداء الموظفين.',
    performance_summary: 'ملخص الأداء',
    performance_teamwork: 'العمل الجماعي',
    performance_technical_skills: 'المهارات الفنية',
    performance_template: 'النموذج',
    performance_template_archived: 'تم أرشفة النموذج بنجاح',
    performance_template_created: 'تم إنشاء النموذج كمسودة',
    performance_template_name: 'اسم النموذج',
    performance_template_name_required: 'اسم النموذج مطلوب',
    performance_template_placeholder: 'مثال: مراجعة الأداء السنوية',
    performance_template_published: 'تم نشر النموذج بنجاح',
    performance_template_status_updated: 'تم تحديث حالة القالب إلى {{status}}',
    performance_templates_subtitle: 'إدارة نماذج مراجعة الأداء والمعايير الخاصة بك.',
    performance_templates_title: 'نماذج التقييم',
    performance_timeline: 'الجدول الزمني',
    performance_top_performers: 'أفضل الموظفين أداءً',
    performance_top_rated_employees: 'الموظفون الأعلى تقييماً',
    performance_update_template: 'تحديث القالب',
    performance_version: 'الإصدار',
    period: 'الفترة',
    periodic: 'دوري',
    personal_details: 'التفاصيل الشخصية',
    personal_information: 'المعلومات الشخصية',
    pharmacy: 'الصيدلية',
    phone: 'الهاتف',
    phone_number: 'رقم الهاتف',
    phone_placeholder: 'مثال: +123456789',
    physician: 'الطبيب',
    physician_placeholder: 'مثال: د. سارة سميث',
    please_wait: 'يرجى الانتظار...',
    pm: 'م',
    policies: 'السياسات',
    policy_violation: 'مخالفة السياسة',
    position: 'المنصب',
    position_placeholder: 'مثال: ممرض مسجل',
    positions: 'المناصب',
    pre_employment: 'ما قبل التوظيف',
    previous: 'السابق',
    primary_gradient: 'التدرج الأساسي',
    primary_role: 'الدور الأساسي',
    primary_specialty: 'التخصص الرئيسي',
    primary_specialty_desc: 'مجال الممارسة الرئيسي والمسؤولية السريرية.',
    print: 'طباعة',
    privacy_gdpr: 'الخصوصية واللائحة العامة لحماية البيانات',
    privacy_gdpr_desc: 'تكوين اتفاقيات معالجة البيانات وروابط سياسة الخصوصية.',
    probation_end: 'نهاية فترة التجربة',
    probation_period: 'فترة التجربة',
    process_payroll: 'معالجة الرواتب',
    processed_queue: 'تمت معالجتها',
    prof_licenses: 'التراخيص المهنية',
    professional_summary: 'الملخص المهني',
    profile: 'ملفي الشخصي',
    profile_settings_subtitle: 'تحديث معلوماتك الشخصية وملفك الشخصي العام',
    profile_subtitle: 'إدارة معلوماتك الشخصية والمهنية',
    provide_closure_note: 'تقديم ملاحظة الإغلاق',
    provide_expiry_date: 'يرجى تحديد تاريخ انتهاء جديد.',
    provide_rejection_reason: 'يرجى تقديم سبب الرفض',
    provider: 'المزود',
    provider_placeholder: 'مثال: العيادة الرئيسية',
    publish: 'نشر',
    publish_schedule: 'نشر الجدول',
    published: 'منشور',
    push_notifications: 'تنبيهات الدفع',
    push_notifications_desc: 'تلقي تنبيهات المتصفح في الوقت الفعلي',
    qualification: 'المؤهل',
    qualification_details: 'تفاصيل المؤهل',
    quarterly: 'ربع سنوي',
    quick_assign: 'تعيين سريع',
    quick_links: 'روابط سريعة',
    radiology: 'الأشعة',
    read_only_view: 'عرض للقراءة فقط',
    reason: 'السبب',
    reason_closing_placeholder: 'مثال: تم ملء الوظيفة، لم تعد هناك حاجة إليها...',
    reason_for_correction: 'سبب التصحيح',
    reason_placeholder: 'أدخل السبب هنا...',
    reason_rejection_placeholder: 'مثال: قيود الميزانية، الوظيفة معلقة...',
    reason_required: 'السبب مطلوب',
    recent_activity: 'النشاط الأخير',
    recently_deleted: 'المحذوفة مؤخراً',
    recommendations: 'التوصيات',
    recruitment: 'التوظيف',
    recruitment_about_to_create_employee: 'أنت على وشك إنشاء سجل موظف جديد من هذا المرشح.',
    recruitment_add_candidate: 'إضافة مرشح',
    recruitment_all_departments: 'جميع الأقسام',
    recruitment_all_statuses: 'جميع الحالات',
    recruitment_allowances: 'البدلات (سنوية)',
    recruitment_accepted: 'مقبول',
    recruitment_applied: 'تم التقديم',
    recruitment_approved: 'معتمد',
    recruitment_approve: 'موافقة',
    recruitment_approve_offer: 'الموافقة على العرض',
    recruitment_back: 'السابق',
    recruitment_base_salary: 'الراتب الأساسي (سنوي)',
    recruitment_cancel: 'إلغاء',
    recruitment_cancel_confirmation_text: 'أنت على وشك إلغاء المقابلة لـ {{name}}. لا يمكن التراجع عن هذا الإجراء.',
    recruitment_cancelled: 'ملغي',
    recruitment_candidate: 'المرشح',
    recruitment_candidate_added_success: 'تم إضافة المرشح بنجاح.',
    recruitment_candidate_details: 'تفاصيل المرشح',
    recruitment_candidate_editing_soon: 'تعديل المرشح سيكون متاحاً قريباً',
    recruitment_candidate_hired_success: 'تم تحديد المرشح {{name}} كموظف.',
    recruitment_candidate_moved_interview: 'تم نقل المرشح {{name}} إلى المقابلة. هل تريد جدولة مقابلة الآن؟',
    recruitment_candidate_moved_offer: 'تم نقل المرشح {{name}} إلى العرض. هل تريد إنشاء مسودة عرض الآن؟',
    recruitment_candidate_moved_to: 'تم نقل {{name}} إلى {{stage}}',
    recruitment_candidate_pipeline: 'مسار المرشحين',
    recruitment_candidate_profile: 'ملف المرشح',
    recruitment_candidate_rejected_success: 'تم رفض المرشح.',
    recruitment_candidates: 'المرشحون',
    recruitment_close_job_opening: 'إغلاق الوظيفة الشاغرة',
    recruitment_close_job_opening_msg: 'سيؤدي هذا أيضاً إلى إغلاق الوظيفة الشاغرة المرتبطة.',
    recruitment_close_opening: 'إغلاق الوظيفة',
    recruitment_closed: 'مغلق',
    recruitment_completed: 'مكتملة',
    recruitment_confirm_close: 'تأكيد الإغلاق',
    recruitment_confirm_decline: 'تأكيد الرفض',
    recruitment_confirm_reject: 'تأكيد الرفض',
    recruitment_confirm_reject_btn: 'تأكيد الرفض',
    recruitment_contract_type: 'نوع العقد',
    recruitment_convert_to_employee: 'تحويل إلى موظف',
    recruitment_convert_wizard_title: 'تحويل المرشح إلى موظف',
    recruitment_create_opening: 'إنشاء وظيفة',
    recruitment_created_at: 'تاريخ الإنشاء',
    recruitment_date: 'التاريخ',
    recruitment_date_time: 'التاريخ والوقت',
    recruitment_decline_reason: 'سبب الرفض',
    recruitment_decline_reason_desc: 'يرجى تقديم سبب لرفض المرشح للعرض.',
    recruitment_decline_reason_placeholder: 'سبب الرفض (مثلاً: الراتب منخفض جداً، قبل عرضاً آخر)...',
    recruitment_decline_reason_prompt: 'يرجى تقديم سبب لرفض المرشح للعرض.',
    recruitment_department: 'القسم',
    recruitment_draft: 'مسودة',
    recruitment_education_not_specified: 'غير محدد',
    recruitment_email: 'البريد الإلكتروني',
    recruitment_entry: 'مستوى مبتدئ',
    recruitment_experience: 'الخبرة (سنوات)',
    recruitment_experience_level: 'مستوى الخبرة',
    recruitment_fail: 'رسوب',
    recruitment_failed_action: 'فشل الإجراء.',
    recruitment_failed_add: 'فشل إضافة المرشح',
    recruitment_failed_decline: 'فشل رفض العرض',
    recruitment_failed_generate: 'فشل إنشاء العرض',
    recruitment_failed_generate_offer: 'فشل إنشاء العرض',
    recruitment_failed_load_interviews: 'فشل تحميل بيانات المقابلات',
    recruitment_failed_load_offers: 'فشل تحميل بيانات العروض',
    recruitment_failed_load_openings: 'فشل تحميل الوظائف الشاغرة',
    recruitment_failed_load_pipeline: 'فشل تحميل بيانات خط التوظيف',
    recruitment_failed_move: 'فشل نقل المرشح',
    recruitment_failed_record: 'فشل تسجيل النتيجة',
    recruitment_failed_reject: 'فشل رفض المرشح',
    recruitment_failed_schedule: 'فشل جدولة المقابلة',
    recruitment_final: 'نهائي',
    recruitment_finalize_create: 'إنهاء وإنشاء',
    recruitment_full_name: 'الاسم الكامل',
    recruitment_generate_draft: 'إنشاء مسودة',
    recruitment_generate_offer: 'إنشاء عرض',
    recruitment_hire_date: 'تاريخ التوظيف',
    recruitment_hired: 'تم التوظيف',
    recruitment_hiring_manager: 'مدير التوظيف',
    recruitment_hr: 'موارد بشرية',
    recruitment_internship: 'تدريب',
    recruitment_interview: 'مقابلة',
    recruitment_interview_cancelled_success: 'تم إلغاء المقابلة بنجاح',
    recruitment_interview_editing_soon: 'تعديل المقابلة سيكون متاحاً قريباً.',
    recruitment_interview_scheduled: 'تم جدولة المقابلة بنجاح.',
    recruitment_interview_type: 'نوع المقابلة',
    recruitment_interviewer: 'المقابل',
    recruitment_interviewers: 'المقابلون',
    recruitment_interviews: 'المقابلات',
    recruitment_invalid_selection: 'المرشح أو الوظيفة المختارة غير صالحة.',
    recruitment_job_description: 'الوصف الوظيفي',
    recruitment_job_description_placeholder: 'الوصف الوظيفي...',
    recruitment_job_details: 'تفاصيل الوظيفة الشاغرة',
    recruitment_job_opening: 'الوظيفة الشاغرة',
    recruitment_job_openings: 'الوظائف الشاغرة',
    recruitment_job_title: 'المسمى الوظيفي',
    recruitment_lead: 'قيادي / إداري',
    recruitment_location_link: 'الموقع / الرابط',
    recruitment_mark_accepted: 'تحديد كمقبول',
    recruitment_mark_as_declined: 'تحديد العرض كمرفوض',
    recruitment_mark_declined: 'تحديد كمرفوض',
    recruitment_mid: 'مستوى متوسط',
    recruitment_nationality: 'الجنسية',
    recruitment_new_candidate: 'مرشح جديد',
    recruitment_new_job_opening: 'وظيفة شاغرة جديدة',
    recruitment_next: 'التالي',
    recruitment_no_candidates: 'لا يوجد مرشحون',
    recruitment_no_permission_action: 'ليس لديك صلاحية للقيام بهذا الإجراء.',
    recruitment_no_permission_add: 'ليس لديك صلاحية لإضافة مرشحين.',
    recruitment_no_permission_generate: 'ليس لديك صلاحية لإنشاء العروض.',
    recruitment_no_permission_generate_offer: 'ليس لديك صلاحية لإنشاء العروض.',
    recruitment_no_permission_move: 'ليس لديك صلاحية لنقل المرشحين.',
    recruitment_no_permission_record: 'ليس لديك صلاحية لتسجيل نتائج المقابلات.',
    recruitment_no_permission_schedule: 'ليس لديك صلاحية لجدولة المقابلات.',
    recruitment_notes: 'ملاحظات / شروط خاصة',
    recruitment_offer: 'عرض',
    recruitment_offer_accepted: 'تم تحديد العرض كمقبول.',
    recruitment_offer_approved: 'تمت الموافقة على العرض.',
    recruitment_offer_declined_success: 'تم تحديد العرض كمرفوض.',
    recruitment_offer_generated: 'تم إنشاء العرض كمسودة.',
    recruitment_offer_sent: 'تم إرسال العرض.',
    recruitment_offers: 'العروض',
    recruitment_open: 'مفتوح',
    recruitment_opening_approved: 'تمت الموافقة على الوظيفة وفتحها.',
    recruitment_opening_closed: 'تم إغلاق الوظيفة الشاغرة',
    recruitment_opening_created_draft: 'تم إنشاء الوظيفة الشاغرة كمسودة.',
    recruitment_opening_rejected: 'تم رفض الوظيفة الشاغرة',
    recruitment_opening_submitted: 'تم تقديم الوظيفة للموافقة.',
    recruitment_outcome: 'النتيجة',
    recruitment_panel: 'لجنة',
    recruitment_pass: 'اجتياز',
    recruitment_passed: 'ناجح',
    recruitment_pending: 'قيد الانتظار',
    recruitment_pending_approval: 'قيد الموافقة',
    recruitment_permissions: 'الأذونات',
    recruitment_phone: 'الهاتف',
    recruitment_position: 'الوظيفة',
    recruitment_position_type: 'نوع الوظيفة',
    recruitment_primary_role: 'الدور الأساسي',
    recruitment_priority: 'الأولوية',
    recruitment_priority_high: 'عالية',
    recruitment_priority_low: 'منخفضة',
    recruitment_priority_medium: 'متوسطة',
    recruitment_proposed_start_date: 'تاريخ البدء المقترح',
    recruitment_provide_reason: 'يرجى تقديم سبب.',
    recruitment_provide_reason_error: 'يرجى تقديم سبب',
    recruitment_provide_rejection_reason: 'يرجى تقديم سبب للرفض.',
    recruitment_ready_finalize: 'جاهز للإنهاء؟',
    recruitment_reason_closing_placeholder: 'قدم سبباً للإغلاق...',
    recruitment_reason_rejection_placeholder: 'قدم سبباً للرفض...',
    recruitment_record_result: 'تسجيل النتيجة',
    recruitment_reject: 'رفض',
    recruitment_reject_candidate: 'رفض المرشح',
    recruitment_reject_job_opening: 'رفض الوظيفة الشاغرة',
    recruitment_reject_opening_msg: 'هل أنت متأكد من رغبتك في رفض طلب الوظيفة الشاغرة هذا؟',
    recruitment_rejected: 'مرفوض',
    recruitment_rejection_reason_msg: 'يرجى تقديم سبب لرفض {{name}}.',
    recruitment_rejection_reason_placeholder: 'سبب الرفض...',
    recruitment_requirements: 'المتطلبات',
    recruitment_requirements_placeholder: 'قائمة المتطلبات الأساسية...',
    recruitment_result_recorded: 'تم تسجيل نتيجة المقابلة',
    recruitment_resume_cv: 'السيرة الذاتية',
    recruitment_salary: 'الراتب',
    recruitment_save: 'حفظ',
    recruitment_save_result: 'حفظ النتيجة',
    recruitment_schedule_interview: 'جدولة مقابلة',
    recruitment_scheduled: 'مجدولة',
    recruitment_score: 'الدرجة',
    recruitment_screening: 'الفحص',
    recruitment_search_placeholder: 'البحث بالعنوان أو القسم أو المعرف...',
    recruitment_select_outcome_error: 'يرجى تحديد النتيجة.',
    recruitment_senior: 'مستوى سينيور',
    recruitment_sent: 'تم الإرسال',
    recruitment_source: 'المصدر',
    recruitment_start_date: 'تاريخ البدء',
    recruitment_status: 'الحالة',
    recruitment_step_confirm_data: 'تأكيد البيانات',
    recruitment_step_finalize: 'إنهاء',
    recruitment_step_job_assignment: 'تعيين الوظيفة',
    recruitment_step_roles_access: 'الأدوار والوصول',
    recruitment_submit_approval: 'إرسال للموافقة',
    recruitment_submit_for_approval: 'إرسال للموافقة',
    recruitment_subtitle: 'إدارة الوظائف الشاغرة الداخلية، والمرشحين، وعملية التوظيف.',
    recruitment_supervisor: 'المشرف',
    recruitment_technical: 'تقني',
    recruitment_time: 'الوقت',
    recruitment_vacancies: 'عدد الشواغر',
    recruitment_view_details: 'عرض التفاصيل',
    recruitment_view_pipeline: 'عرض المسار',
    recruitment_withdrawn: 'منسحب',
    referral: 'إحالة',
    refresh_data: 'تحديث البيانات',
    reject: 'رفض',
    reject_correction_hint: 'يرجى تقديم سبب لرفض طلب التصحيح هذا. سيكون هذا مرئياً للموظف.',
    reject_correction_request: 'رفض طلب التصحيح',
    reject_verification: 'رفض التحقق',
    rejected: 'مرفوض',
    rejection_failed: 'فشل الرفض',
    rejection_reason: 'سبب الرفض',
    rejection_reason_desc: 'يرجى تقديم سبب لرفض هذا الطلب. سيكون هذا مرئياً لصاحب الطلب.',
    rejection_reason_placeholder: 'أدخل سبب الرفض...',
    rejection_success: 'تم الرفض بنجاح',
    hospital_name_label: 'اسم المستشفى',
    logo_label: 'شعار المستشفى',
    upload_logo: 'تحميل الشعار',
    language_label: 'لغة النظام',
    timezone_label: 'المنطقة الزمنية',
    gulf_standard_time: 'توقيت الخليج القياسي (UTC+4)',
    arabian_standard_time: 'توقيت عربي قياسي (UTC+3)',
    security_level: 'مستوى الأمان',
    strong: 'قوي',
    sms_alerts: 'تنبيهات SMS',
    gdpr_compliance: 'وضع الامتثال لـ GDPR',
    gdpr_compliance_desc: 'فرض سياسات صارمة للتعامل مع البيانات',
    data_retention: 'فترة الاحتفاظ بالبيانات (سنوات)',
    main_campus: 'الحرم الرئيسي',
    west_wing: 'الجناح الغربي',
    east_wing: 'الجناح الشرقي',
    outpatient_clinic: 'عيادة خارجية',
    research_center: 'مركز الأبحاث',
    level_department: 'قسم',
    level_unit: 'وحدة',
    level_section: 'شعبة',
    top_level: 'لا يوجد (المستوى الأعلى)',
    action_create: 'إنشاء',
    action_update: 'تحديث',
    action_delete: 'حذف',
    action_login: 'تسجيل دخول',
    action_logout: 'تسجيل خروج',
    ip_address: 'عنوان IP',
    user_agent: 'وكيل المستخدم',
    remaining_leaves: 'الإجازات المتبقية',
    remember_me: 'تذكرني لمدة 30 يوماً',
    reminder_checkout: 'لا يمكن تسجيل الخروج قبل تسجيل الدخول.',
    reminder_late: 'يُسجَّل الحضور بعد الساعة 08:00 كحضور متأخر.',
    reminder_missing: 'يجب تصحيح تسجيلات الخروج المفقودة من الأيام السابقة عبر "طلبات التصحيح".',
    reminder_policy: 'يُسجَّل وقت حضورك تلقائياً وفقاً للمناوبة المحددة لك.',
    renew_license: 'تجديد الترخيص',
    renew_license_desc: 'يرجى تحديد تاريخ انتهاء جديد ورفع المستند المحدث لتجديد هذا المؤهل.',
    renew_qualification: 'تجديد المؤهل',
    renew_success: 'تم تجديد {type} بنجاح. تاريخ الانتهاء الجديد: {date}',
    replacement_employee: 'الموظف البديل',
    report: 'تقرير',
    report_builder: 'منشئ التقارير',
    report_catalog: 'كتالوج التقارير',
    report_download_success: 'تم تنزيل التقرير بنجاح',
    report_history: 'سجل التقارير',
    report_incident: 'الإبلاغ عن حادث',
    report_incident_subtitle: 'تسجيل حادثة سلامة جديدة في مكان العمل أو تعرض صحي.',
    reported_by: 'تم الإبلاغ بواسطة',
    reports: 'التقارير',
    reports_adjust_filters: 'حاول تعديل البحث أو فلاتر الفئات',
    reports_all_categories: 'جميع الفئات',
    reports_all_departments: 'جميع الأقسام',
    reports_all_statuses: 'جميع الحالات',
    reports_compile_data_note: 'سنقوم بتجميع جميع البيانات عبر الفترة والفلاتر المختارة.',
    reports_compliance: 'الامتثال',
    reports_configure_custom: 'تكوين تقريرك المخصص',
    reports_customizing: 'تخصيص: {name}',
    reports_data_preview: 'معاينة البيانات (أعلى 50 صفاً)',
    reports_download_excel: 'تنزيل Excel',
    reports_download_pdf: 'تنزيل PDF',
    reports_employee_optional: 'الموظف (اختياري)',
    reports_executive: 'تنفيذي',
    reports_filters_applied: 'الفلاتر المطبقة',
    reports_attendance_report_desc: 'الحضور اليومي، الوصول المتأخر، وتحليل العمل الإضافي.',
    reports_attendance_report_name: 'تقرير الحضور التشغيلي',
    reports_budget_utilization_desc: 'تفصيل دقيق للرواتب والإنفاق التشغيلي حسب القسم.',
    reports_budget_utilization_name: 'استخدام ميزانية الأقسام',
    reports_compliance_audit_desc: 'تتبع جميع تجديدات التراخيص وإكمال التدريب الإلزامي.',
    reports_compliance_audit_name: 'سجل تدقيق الامتثال',
    reports_executive_summary_desc: 'نظرة عامة رفيعة المستوى على عدد الموظفين، ومعدل الدوران، وتكاليف العمالة.',
    reports_executive_summary_name: 'ملخص القوى العاملة التنفيذي',
    reports_financial: 'مالي',
    reports_payroll_variance_desc: 'مقارنة رواتب الشهر الحالي مقابل الشهر السابق.',
    reports_payroll_variance_name: 'تحليل تباين الرواتب',
    reports_recruitment_funnel_desc: 'تحليل مسار المرشحين من التقديم إلى التوظيف.',
    reports_recruitment_funnel_name: 'مقاييس قمع التوظيف',
    reports_format: 'التنسيق',
    reports_generate_full: 'إنشاء التقرير الكامل',
    reports_generated_at: 'تم الإنشاء في',
    reports_generated_by: 'تم الإنشاء بواسطة',
    reports_generated_success: 'تم إنشاء التقرير بنجاح!',
    reports_generating: 'جاري إنشاء التقرير...',
    reports_id: 'المعرف',
    reports_id_label: 'معرف التقرير',
    reports_immutable_note_text: 'هذا السجل جزء من مسار التدقيق غير القابل للتغيير. أي تغييرات في البيانات الأساسية بعد الإنشاء لن تنعكس في نسخة التقرير هذه.',
    reports_immutable_note_title: 'ملاحظة السجل غير القابل للتغيير',
    reports_metadata: 'بيانات التقرير الوصفية',
    reports_mock_data_note: 'عرض بيانات وهمية بناءً على الفلاتر المختارة',
    reports_name: 'الاسم',
    reports_no_reports_found: 'لم يتم العثور على تقارير',
    reports_open_in_builder: 'فتح في المنشئ',
    reports_operational: 'تشغيلي',
    reports_period: 'الفترة',
    reports_ready_for_download: 'تقريرك جاهز للتنزيل وتم حفظه في السجل.',
    reports_ready_to_generate: 'جاهز للإنشاء؟',
    reports_scope_dept: 'قسم النطاق',
    reports_search_employee_placeholder: 'البحث عن موظف معين...',
    reports_search_placeholder: 'البحث في التقارير بالاسم أو الوصف...',
    reports_standardized_templates: 'قوالب موحدة لمقاييس {type}.',
    reports_step_filters: 'الفلاتر',
    reports_step_generate: 'إنشاء',
    reports_step_preview: 'معاينة',
    reports_step_type: 'النوع',
    reports_subtitle: 'إنشاء وجدولة وتحليل بيانات المستشفى.',
    reports_value: 'القيمة',
    reports_workforce: 'القوى العاملة',
    request_admin_access: 'طلب وصول مسؤول',
    request_for: 'طلب لـ',
    request_leave: 'طلب إجازة',
    request_type: 'نوع الطلب',
    requested_in: 'وقت الدخول المطلوب',
    requested_out: 'وقت الخروج المطلوب',
    requester: 'صاحب الطلب',
    required: 'مطلوب',
    required_documents: 'المستندات المطلوبة',
    requirements_placeholder: 'مثال: خبرة 5+ سنوات، درجة البكالوريوس...',
    results: 'نتائج',
    results_analytics: 'النتائج والتحليلات',
    results_summary: 'ملخص النتائج',
    return_to_work: 'العودة للعمل',
    returns_monday: 'يعود يوم الاثنين',
    role: 'الدور',
    role_definitions: 'تعريفات الأدوار',
    roster_summary: 'ملخص مناوبات اليوم',
    rule_name: 'اسم القاعدة',
    rules_rates: 'القواعد والأسعار',
    run_checklist: 'قائمة مراجعة التشغيل',
    run_create_failed: 'فشل في إنشاء تشغيل الرواتب',
    run_created_success: 'تم إنشاء تشغيل الرواتب بنجاح',
    run_locked: 'تم قفل التشغيل',
    run_locked_success: 'تم قفل تشغيل الرواتب للمراجعة',
    run_payroll_subtitle: 'حدد فترة وقم بمعالجة الرواتب الشهرية.',
    run_unlocked: 'تم فتح التشغيل',
    run_unlocked_success: 'تم فتح تشغيل الرواتب',
    sat: 'السبت',
    save: 'حفظ',
    save_changes: 'حفظ التغييرات',
    save_component: 'حفظ المكون',
    save_draft: 'حفظ كمسودة',
    save_settings: 'حفظ الإعدادات',
    schedule: 'الجدول',
    schedule_checkup: 'جدولة فحص',
    schedule_checkup_subtitle: 'جدولة فحص طبي جديد أو تقييم صحي.',
    scheduling: 'الجدولة',
    scheduling_subtitle: 'تخطيط المناوبات، وإدارة التغطية، والتعامل مع طلبات التبديل.',
    scheduling_title: 'جدولة القوى العاملة',
    scope: 'النطاق',
    search: 'بحث...',
    search_approvals_placeholder: 'البحث في الموافقات حسب صاحب الطلب أو النوع...',
    search_attendance_placeholder: 'البحث عن موظف، معرف، أو قسم...',
    search_candidate: 'بحث عن مرشح',
    search_candidate_placeholder: 'البحث بالاسم أو البريد الإلكتروني...',
    search_checkups: 'البحث في الفحوصات...',
    search_components: 'البحث عن المكونات...',
    search_docs_placeholder: 'البحث في المستندات بالاسم...',
    search_employee: 'البحث عن موظف',
    search_employee_dept: 'البحث عن موظف أو قسم...',
    search_employee_placeholder: 'البحث بالاسم، الكود، أو الهاتف...',
    search_follow_ups: 'البحث في المتابعات...',
    search_incidents: 'البحث في الحوادث...',
    search_logs_placeholder: 'البحث في السجلات حسب الممثل أو الإجراء أو المعرف...',
    search_org_placeholder: 'البحث عن الأقسام أو الوحدات...',
    search_period: 'البحث عن فترة...',
    search_period_approver: 'البحث عن فترة أو معتمد...',
    search_placeholder: 'بحث...',
    search_placeholder_employees: 'البحث بالاسم أو المعرف أو البريد الإلكتروني...',
    search_placeholder_generic: 'بحث...',
    search_qualifications_placeholder: 'البحث في {type}...',
    search_to_begin: 'ابحث عن موظف لبدء عملية الربط.',
    search_users_placeholder: 'البحث عن المستخدمين بالاسم أو البريد الإلكتروني...',
    search_vaccinations: 'البحث في التطعيمات...',
    security: 'الأمن',
    security_alerts: 'تنبيهات الأمان',
    security_alerts_desc: 'تنبيهات حول أمن الحساب',
    security_auth: 'الأمن والمصادقة',
    security_auth_desc: 'سياسات المصادقة الثنائية، وقواعد تعقيد كلمة المرور، وتكوينات مهلة الجلسة.',
    security_subtitle: 'حافظ على أمان حسابك من خلال إعدادات كلمة المرور والمصادقة',
    security_tab: 'الأمان',
    select_candidate: 'اختر المرشح',
    select_job_opening: 'اختر الوظيفة الشاغرة',
    select_language: 'اختر اللغة',
    select_leave_type: 'اختر نوع الإجازة',
    select_period_create_run: 'حدد فترة وأنشئ تشغيلاً جديداً للبدء.',
    select_primary_specialty: 'اختر التخصص الرئيسي',
    select_replacement: 'اختر الموظف البديل',
    select_role_demo: 'الدور',
    select_theme: 'اختر المظهر',
    selected_candidate: 'المرشح المختار',
    settings: 'الإعدادات',
    settings_saved_success: 'تم حفظ الإعدادات بنجاح',
    settings_subtitle: 'إدارة تفضيلات حسابك وإعدادات النظام',
    severity: 'الخطورة',
    severity_critical: 'حرِج',
    severity_high: 'عالي',
    severity_low: 'منخفض',
    severity_medium: 'متوسط',
    shift_configurations: 'تكوينات المناوبات',
    shift_types: 'أنواع المناوبات',
    shifts_calendar: 'تقويم المناوبات',
    showing_exceptions: 'عرض الاستثناءات',
    showing_results: 'عرض {start} إلى {end} من {total} نتائج',
    sick: 'مرضية',
    sign_in: 'تسجيل الدخول',
    sign_in_subtitle: 'يرجى إدخال التفاصيل الخاصة بك لتسجيل الدخول',
    specialization_certificate: 'شهادة التخصص',
    specialties: 'التخصصات',
    specialty_mapping: 'تخطيط التخصصات',
    stage: 'المرحلة',
    start_date: 'تاريخ البدء',
    start_date_required: 'تاريخ البدء مطلوب',
    start_time: 'وقت البدء',
    state_medical_college: 'كلية الطب الحكومية',
    status: 'الحالة',
    status_closed: 'مغلق',
    status_completed: 'مكتمل',
    status_due: 'مستحق',
    status_followup_required: 'مطلوب متابعة',
    status_open: 'مفتوح',
    status_overdue: 'متأخر',
    status_partially_completed: 'مكتمل جزئياً',
    status_pending: 'قيد الانتظار',
    status_pending_results: 'في انتظار النتائج',
    status_resolved: 'تم الحل',
    status_scheduled: 'مجدول',
    status_under_investigation: 'قيد التحقيق',
    submission_date: 'تاريخ التقديم',
    submitted_at: 'تاريخ التقديم',
    submit: 'إرسال',
    submit_correction_request: 'تقديم طلب تصحيح حضور',
    submit_request: 'تقديم الطلب',
    summary: 'الملخص',
    summary_access: 'وصول للملخص',
    sun: 'الأحد',
    supervisor: 'المشرف',
    surgery_prep: 'تحضير للجراحة',
    swap_requests: 'طلبات التبديل',
    swap_requests_desc: 'ستظهر طلبات الموظفين هنا للموافقة عليها.',
    system_login_desc: 'تمكين الوصول إلى نظام إدارة المستشفى',
    system_settings: 'إعدادات النظام',
    system_settings_read_only_msg: 'إعدادات النظام حالياً للقراءة فقط. يتطلب تعديل هذه القيم وجود واجهة برمجة تطبيقات خلفية متصلة لحفظ التغييرات في قاعدة البيانات وتشغيل تحديثات تكوين النظام بالكامل.',
    system_status_healthy: 'حالة النظام: سليم',
    tab_loading_desc: 'يتم تحميل المعلومات التفصيلية لـ {tab}. يتضمن هذا القسم سجلات وتاريخاً شاملاً.',
    tags: 'الوسوم',
    talent: 'المواهب',
    task: 'المهمة',
    tax_rules: 'قواعد الضرائب',
    tax_social_security: 'الضرائب والتأمينات الاجتماعية',
    team_meeting: 'اجتماع الفريق',
    technician: 'فني',
    template: 'قالب',
    terminate: 'إنهاء الخدمة',
    terminate_confirm_msg: 'أنت على وشك إنهاء خدمة {name}. سيؤدي هذا الإجراء إلى إلغاء وصولهم وبدء عملية إنهاء الخدمة.',
    terminate_employee: 'إنهاء خدمة موظف',
    termination_initiated: 'بدأت عملية إنهاء الخدمة لـ {name}',
    theme: 'المظهر',
    theme_berry: 'وردي توتي',
    theme_forest: 'أخضر الغابة',
    theme_indigo: 'بنفسجي نيلي',
    theme_medical: 'طبي أخضر-أزرق',
    theme_royal: 'أزرق ملكي',
    theme_sky: 'سماوي فاتح',
    theme_sunset: 'برتقالي الغروب',
    theme_teal: 'فيروزي',
    thu: 'الخميس',
    time_range: 'النطاق الزمني',
    timestamp: 'الطابع الزمني',
    to: 'إلى',
    today: 'اليوم',
    todays_schedule: 'جدول اليوم',
    tomorrow: 'غداً',
    total_allowances: 'إجمالي البدلات',
    total_base: 'إجمالي الأساسي',
    total_deductions: 'إجمالي الاستقطاعات',
    total_documents: 'إجمالي المستندات',
    total_employees: 'إجمالي الموظفين',
    total_files: 'إجمالي الملفات',
    total_hours: 'إجمالي الساعات',
    total_worked: 'إجمالي ساعات العمل',
    total_net: 'إجمالي الصافي',
    total_paid_ytd: 'إجمالي المدفوع (منذ بداية العام)',
    total_runs: 'إجمالي التشغيلات',
    training_certificate: 'شهادة تدريب',
    trend_action_required: 'مطلوب اتخاذ إجراء',
    trend_high_priority: '2 أولوية عالية',
    trend_month: '5 هذا الشهر',
    trend_pre_employment: '3 ما قبل التوظيف',
    trend_stable: 'مستقر',
    trend_week: '+1 هذا الأسبوع',
    tue: 'الثلاثاء',
    two_factor_auth: 'المصادقة الثنائية',
    two_factor_subtitle: 'أضف طبقة إضافية من الأمان إلى حسابك',
    type: 'النوع',
    types_policies: 'الأنواع والسياسات',
    annual_entitlement: 'الاستحقاق السنوي (أيام)',
    max_carry_over: 'أقصى ترحيل (أيام)',
    min_notice_days: 'أقل مدة إخطار (أيام)',
    requires_attachment: 'يتطلب مرفق',
    is_paid: 'مدفوع',
    update_policy: 'تحديث السياسة',
    policy_updated_success: 'تم تحديث سياسة الإجازة بنجاح',
    understaffed: 'نقص الموظفين',
    understaffed_shifts: 'مناوبات تعاني من نقص الموظفين',
    unit: 'الوحدة',
    units: 'الوحدات',
    university_healthcare: 'جامعة الرعاية الصحية',
    unlock_failed: 'فشل في فتح تشغيل الرواتب',
    unlock_run: 'فتح التشغيل',
    manage_leave_rules: 'تكوين القواعد والاستحقاقات لكل نوع إجازة.',
    attachment_policy_desc: 'يتطلب إثباتاً طبياً أو رسمياً لهذه الإجازة.',
    payment_policy_desc: 'تحديد ما إذا كانت هذه الإجازة مدفوعة بالكامل أو مخصومة.',
    paid: 'مدفوع',
    unpaid: 'بدون راتب',
    unpaid_leave_detected: 'تم اكتشاف إجازة غير مدفوعة',
    unsaved_changes: 'تغييرات غير محفوظة',
    upcoming_appointments: 'ملخص المواعيد القادمة',
    upcoming_events: 'الأحداث القادمة',
    update_qualification: 'تحديث المؤهل',
    update_status: 'تحديث الحالة',
    upload: 'رفع',
    upload_attachment: 'إرفاق مستند',
    upload_credentials: 'رفع الاعتمادات',
    upload_credentials_desc: 'قم بسحب وإفلات الملفات هنا، أو انقر للتصفح',
    upload_cv_hint: 'انقر للتحميل أو اسحب وأفلت',
    upload_date: 'تاريخ الرفع',
    upload_document: 'رفع مستند',
    upload_file: 'رفع ملف',
    upload_success: 'تم الرفع بنجاح',
    upload_documents: 'رفع المستندات',
    upload_documents_desc: 'مستندات الامتثال والهوية المطلوبة',
    uploading: 'جاري الرفع...',
    uploaded_by: 'تم الرفع بواسطة',
    applied_date: 'تاريخ التقديم',
    attendance_management: 'إدارة الحضور',
    convert_to_employee: 'تحويل إلى موظف',
    curriculum_vitae: 'السيرة الذاتية',
    department_head: 'رئيس القسم',
    experience: 'الخبرة',
    experience_years: 'سنوات الخبرة',
    is_overnight: 'مناوبة ليلية',
    generate_offer: 'إنشاء عرض',
    job_opening: 'وظيفة شاغرة',
    legacy_attachment: 'مرفق قديم',
    no_documents_attached: 'لا توجد مستندات مرفقة',
    resume_cv: 'السيرة الذاتية',
    schedule_interview: 'جدولة مقابلة',
    scheduling_access: 'الوصول إلى الجدولة',
    select_position: 'اختر المنصب',
    select_supervisor: 'اختر المشرف',
    select_type: 'اختر النوع',
    self_service_portal: 'بوابة الخدمة الذاتية',
    source: 'المصدر',
    stage_history: 'سجل المراحل',
    uploaded_documents: 'المستندات المرفوعة',
    urgent_alerts: 'تنبيهات عاجلة',
    user_list_unavailable: 'قائمة المستخدمين غير متوفرة',
    user_list_unavailable_desc: 'تتطلب واجهة إدارة المستخدمين اتصالاً آمناً بخدمة مصادقة الواجهة الخلفية.',
    user_management_placeholder: 'مكان إدارة المستخدمين',
    user_management_placeholder_desc: 'ستتفاعل هذه الوحدة مع موفر الهوية المركزي (IdP) لإدارة حسابات المستخدمين والأدوار والأذونات الدقيقة.',
    username_or_email: 'اسم المستخدم أو البريد الإلكتروني',
    users_access: 'المستخدمون والوصول',
    v2_optional_toggles: 'خيارات إضافية V2',
    vaccination: 'تطعيم',
    vaccination_added_failed: 'فشل إضافة التطعيم',
    vaccination_added_success: 'تم إضافة التطعيم بنجاح',
    vaccination_coverage: 'تغطية التطعيم',
    vaccination_details: 'تفاصيل التطعيم',
    vaccinations: 'التطعيمات',
    vaccine_name: 'اسم اللقاح',
    vaccine_placeholder: 'مثال: التهاب الكبد ب',
    valid: 'صالح',
    value: 'القيمة',
    verification: 'التحقق',
    verification_failed: 'فشل التحقق',
    verification_queue: 'قائمة التحقق',
    verification_review: 'مراجعة التحقق',
    verification_success: 'تم التحقق بنجاح',
    verify: 'تحقق',
    version: 'الإصدار',
    view: 'عرض',
    view_profile: 'عرض الملف الشخصي',
    quick_actions: 'إجراءات سريعة',
    system_health: 'صحة النظام',
    active_users: 'المستخدمون النشطون',
    payroll_cycle: 'دورة الرواتب',
    cutoff_date: 'تاريخ الإغلاق',
    calculation_progress: 'تقدم الحساب',
    my_department: 'قسمي',
    staffing_levels: 'مستويات التوظيف',
    workforce_health: 'صحة القوى العاملة',
    compliance_status: 'حالة الامتثال',
    audit_logs: 'سجلات المراجعة',
    view_payslip: 'عرض قسيمة الراتب',
    system_uptime: 'وقت تشغيل النظام',
    user_activity_trend: 'اتجاه نشاط المستخدم',
    recent_hires: 'التعيينات الأخيرة',
    view_all: 'عرض الكل',
    dept_attendance: 'حضور القسم',
    approve_leaves: 'الموافقة على الإجازات',
    failed_login_attempts: 'محاولات تسجيل دخول فاشلة',
    view_details: 'عرض التفاصيل',
    view_draft_sheet: 'عرض مسودة الكشف',
    view_exceptions: 'عرض الاستثناءات',
    view_exceptions_only: 'عرض الاستثناءات فقط',
    view_schedule: 'عرض الجدول',
    visual_org_chart: 'الهيكل التنظيمي المرئي',
    vs_last_month: 'مقارنة بالشهر الماضي',
    wed: 'الأربعاء',
    week: 'أسبوع',
    weekend_allowance: 'بدل عطلة نهاية الأسبوع',
    weekly_schedule_preview: 'معاينة الجدول الأسبوعي',
    welcome_back: 'مرحباً بعودتك',
    wizard_subtitle: 'أكمل الخطوات أدناه لإدارة الاعتمادات الطبية.',
    work_information: 'معلومات العمل',
    work_location: 'موقع العمل',
    workforce_management: 'إدارة القوى العاملة',
    working_hours_policies: 'سياسات ساعات العمل',
    years: 'سنوات',
    yes_cancel: 'نعم، إلغاء',
  }
} as const;
