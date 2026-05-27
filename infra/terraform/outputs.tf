output "web_url" {
  description = "URL of the frontend application"
  value       = module.ecs.web_url
}

output "api_url" {
  description = "URL of the backend API"
  value       = module.ecs.api_url
}
